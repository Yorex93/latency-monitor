const WatchedService = require('../../db').WatchedService;
const Settings = require('../../db').Settings;

async function findAll(){
    return await WatchedService.find();
}

async function findById(id){
    return await WatchedService.findById(id, { responseTimes: 0 });
}

async function findByIdFull(id){
    return await WatchedService.findById(id);
}

async function create(createRequest){
    const request = {
        endPoint: createRequest.endpoint,
        name: createRequest.name
    }
    return await WatchedService.create(request);
}

async function destroy(id){
    await WatchedService.findByIdAndRemove(id);
}

async function addRequestTime(requestTime, id){
    const service = await WatchedService.findById(id);
    service.requestTimes.push(requestTime);
    return await service.save()
}

async function setActiveStatus(id, active) {
    return await WatchedService.findByIdAndUpdate(id, {
        active 
    });
}

async function getPaginatedRequestTimes(id, page = 0, pageSize = 15){
    return new Promise((resolve, reject) => {
        WatchedService.findById(id)
        .exec(function(err, service) {
            if(err){
                reject(err);
            }
            const totalElements = service.responseTimes.length;
            const pages = Math.ceil(totalElements / pageSize);
            const slicedResponseTimes = service.responseTimes.slice(page * pageSize, pageSize * (page + 1));
            service.responseTimes = slicedResponseTimes;
            resolve({
                service,
                pagination: {
                    page,
                    pageSize,
                    totalElements,
                    pages
                }
            })
        })
    });
}

async function getSettings(){
    return await Settings.findOne({});
}

async function createSetting(){
    return await Settings.create({
        pollingRate: 1800000
    })
}

async function updateSettings(id, request) {
    return await Settings.findByIdAndUpdate(id, {
        pollingRate: request.pollingRate
    });
}

module.exports = {
    findAll,
    findById,
    create,
    destroy,
    findByIdFull,
    setActiveStatus,
    getPaginatedRequestTimes,
    getSettings,
    updateSettings,
    createSetting
}
