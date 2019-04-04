const WatchedService = require('../../db').WatchedService;
const ResponseTime = require('../../db').ResponseTime;
const config = require('../../config');

const request = require('request');

async function process(){
    const watchedServices = await WatchedService.find({ active: true }, { responseTimes: 0 });
    console.log("Watched service count ", watchedServices.length);
    watchedServices.forEach(service => makeRequest(service));
}

async function makeRequest(service){
    return new Promise((resolve, reject) => {
        let errorMsg = "";

        request.get({ url: service.endPoint,  time: true }, (err, response) => {
            if(err){
                const responseTime = new ResponseTime({
                    dataReceived: "",
                    elapsedTime: 0,
                    timings: null,
                    timingPhases: null,
                    error: true,
                    errorDescription: JSON.stringify(err)
                });
                WatchedService.findByIdAndUpdate(service._id, {
                    $inc: {
                        "failureResponseCount": 1
                    },
                    $push: {
                        "responseTimes": { "$each": [responseTime], "$position": 0 }
                    }
                }, 
                {
                    safe: true
                },
                function(err, model) {
                    if(err){
                        console.log(err);
                    }
                    
                });
                
                errorMsg = `Request made for APi Endpoint ${service.endPoint} with Error: ${err} `;
                reject(errorMsg);
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
            
                const newAvrg = ((currentAvgResponseTime * service.successResponseCount) + response.elapsedTime) / (service.successResponseCount + 1);
                WatchedService.findByIdAndUpdate(service._id, {
                    $set: {
                        "maxResponseTime": Math.round(currentMaxResponseTime),
                        "minResponseTime": Math.round(currentMinResponseTime),
                        "avrgResponseTime": Math.round(newAvrg),
                    },
                    $inc:{
                        "successResponseCount": 1
                    },
                    $push: {
                        "responseTimes": { "$each": [responseTime], "$position": 0 }
                    }
                }, 
                {
                    safe: true
                },
                function(err) {
                    if(err){
                        console.log("Error occurred while updating service", err);
                        reject(err);
                    } else{
                        console.log('Request made for APi Endpoint: ', service.endPoint);
                        resolve(responseTime)
                    }
                });

            }
        });
        
    });
}

let intervalObj = null;

function start(timeInMilli = config.app.defaultPollInterval || 10000){
    console.log(`Starting Background Processing, Polling every ${timeInMilli / 1000} seconds`);
    intervalObj = setInterval(() => {
        process();
    }, timeInMilli);
}



function stop(){
    console.log("Stopping Background Processing");
    clearInterval(intervalObj);
    intervalObj = null;
}

function isRunning(){
    return intervalObj !== null;
}


module.exports = {
    start,
    stop,
    isRunning
}
