const WatchedService = require('../../db').WatchedService;
const RequestTime = require('../../db').RequestTime;

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
    const service = await WatchedService.deleteOne({ id });
    await service.remove();
}

async function addRequestTime(requestTime, id){
    const service = await WatchedService.findById(id);
    service.requestTimes.push(requestTime);
    return await service.save()
}

module.exports = {
    findAll,
    findById,
    create,
    destroy,
    findByIdFull
}
