const WatchedService = require('../../db').WatchedService;
const RequestTime = require('../../db').RequestTime;

async function findAll(){
    return await WatchedService.find();
}

async function findById(id){
    return await WatchedService.findById(id);
}

async function create(request){
    const request = {
        endpoint: request.endpoint,
        name: request.name
    }
    return await WatchedService.create(request);
}

async function destroy(id){
    const service = await WatchedService.deleteOne({ id });
    await service.remove();
}

module.exports = {
    findAll,
    findById,
    create,
    destroy
}
