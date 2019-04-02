const express = require('express');
const router = express.Router();
const latencyService = require('../modules/latency/latency.service');
const schemaValidator = require('../middleware/schema-validator');
const watchedServiceSchema = require('../validators').watchedService;

router.get('/', (req, res, next) => {
    latencyService.findAll().then(services => {
        res.render('monitor/index', { services });
    }).catch(err => {
        res.render('monitor/index', { errors: [err] })
    });
});

router.get('/new', (req, res, next) => {
    res.render('monitor/create');
});

router.post('/new', schemaValidator(watchedServiceSchema, 'monitor/create'), (req, res, next) => {
    latencyService.create(req.body).then(createdService => {
        res.render('monitor/create', { successMsg: createdService.name+' Created Successfully' });
    }).catch(err => {
        res.render('monitor/create', { errors: [err], oldValues: req.body })
    });
});


router.get('/:id/details', (req, res, next) => {
    latencyService.findByIdFull(req.params.id).then(service => {
        console.log(service)
        res.render('monitor/show', { service });
    }).catch(err => {
        res.render('monitor/show', { errors: [err] })
    });
    res.render('monitor/show');
});

module.exports = router;
