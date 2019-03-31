const request = require('request');
const WatchedService = require('../../db').WatchedService;
const RequestTime = require('../../db').RequestTime;

async function process(){
    const watchedServices = await WatchedService.find();
    watchedServices.forEach(service => makeRequest(service));
}

async function makeRequest(service){
    return new Promise((resolve, reject) => {
        request.get({ url: service.url,  time: true }, function (err, response) {
            if(err){
                const requestTime = new RequestTime({
                    dataReceived: null,
                    elapsedTime: null,
                    timings: null,
                    timingPhases: null,
                    error: true,
                    errorDescription: JSON.stringify(err)
                });
                service.requestTimes.push(requestTime);
                service.save();
                console.log('Request made for APi Endpoint with Error: ', service.url);
                reject(err);
            }

            const requestTime = new RequestTime({
                dataReceived: JSON.stringify(response.body),
                elapsedTime: response.elapsedTime,
                timings: response.timings,
                timingPhases: response.timingPhases
            });
            service.requestTimes.push(requestTime);
            service.save();
            console.log('Request made for APi Endpoint: ', service.url);
            resolve(requestTime)
        });
    });
}

module.exports = {
    process
}
