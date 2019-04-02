const WatchedService = require('../../db').WatchedService;
const ResponseTime = require('../../db').ResponseTime;
const config = require('../../config');

const request = require('request');

async function process(){
    const watchedServices = await WatchedService.find({ }, { requestTimes: 0 });
    watchedServices.forEach(service => makeRequest(service));
}

async function makeRequest(serviceWithoutRequestTimes){
    const service = await WatchedService.findById(serviceWithoutRequestTimes._id);
    return new Promise((resolve, reject) => {
        request.get({ url: service.endPoint,  time: true }, function (err, response) {

            let currentRequestTimesCount;

            if(!service.requestTimes){
                service.requestTimes = [];
                currentRequestTimesCount = 0;
            } else {
                currentRequestTimesCount = service.requestTimes.length;
            }

            if(err){
                const responseTime = new ResponseTime({
                    dataReceived: null,
                    elapsedTime: null,
                    timings: null,
                    timingPhases: null,
                    error: true,
                    errorDescription: JSON.stringify(err)
                });
                WatchedService.findByIdAndUpdate(service._id, {
                    $push: {
                        "responseTimes": responseTime
                    }
                }, 
                {
                    safe: true, upsert: true
                },
                function(err, model) {
                    console.log(err, model);
                });
                console.log(`Request made for APi Endpoint ${service.endPoint} with Error: ${err} `);
                
            } else {

                const responseTime = new ResponseTime({
                    dataReceived: JSON.stringify(response.body),
                    elapsedTime: response.elapsedTime,
                    timings: response.timings,
                    timingPhases: response.timingPhases
                });
                
                let currentMinResponseTime = service.minResponseTime;
                let currentMaxResponseTime = service.maxResponseTime;
                let currentAvgResponseTime = service.avrgResponseTime;

                if(response.elapsedTime > currentMaxResponseTime){
                    currentMaxResponseTime = response.elapsedTime;
                }

                if((response.elapsedTime < currentMinResponseTime) || currentMinResponseTime === 0){
                    currentMinResponseTime = response.elapsedTime;
                }
                const newAvrg = ((currentAvgResponseTime * currentRequestTimesCount) + response.elapsedTime) / (currentRequestTimesCount + 1);
                service.avrgResponseTime = newAvrg;

                WatchedService.findByIdAndUpdate(service._id, {
                    $set: {
                        "maxResponseTime": currentMaxResponseTime,
                        "minResponseTime": currentMinResponseTime,
                        "avrgResponseTime": newAvrg,
                    },
                    $push: {
                        "responseTimes": responseTime
                    }
                }, 
                {
                    safe: true, upsert: true
                },
                function(err, model) {
                    console.log(err, model);
                });
                console.log('Request made for APi Endpoint: ', service.endPoint);
                resolve(responseTime)

            }
        });
        
    });
}

const intervalObj = setTimeout(() => {
    process();
}, 1000)

module.exports = {
    process,
    intervalObj
}
