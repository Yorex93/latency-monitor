const express = require('express');
const router = express.Router();
const latencyService = require('../modules/latency/latency.service');
const schemaValidator = require('../middleware/schema-validator');
const watchedServiceSchema = require('../validators').watchedService;
const settingSchema = require('../validators').settings;
const backgroundService = require('../modules/latency/background-service');
const config = require('../config');

router.get('/', (req, res) => {
    latencyService.findAll().then(services => {
        res.render('monitor/index', { services });
    }).catch(err => {
        res.render('monitor/index', { errors: [err] })
    });
});

router.get('/settings', (req, res) => {
    latencyService.getSettings().then(setting => {
        if(!setting){
            latencyService.createSetting().then(newSetting => {
                res.render('monitor/settings', { setting: newSetting, success: 'Default Settings have been created' });
            }).catch(err => {
                res.render('monitor/settings', { errors: [err] })
            })
        } else{
            res.render('monitor/settings', { setting });
        }
    }).catch(err => {
        res.render('monitor/settings', { errors: [err] })
    });
});

router.post('/settings/:id/update', schemaValidator(settingSchema), (req, res) => {
    latencyService.updateSettings(req.params.id, req.body).then(setting => {
        req.flash('success', 'Settings updated');
        res.redirect('/service-watcher/settings');
    }).catch(err => {
        req.flash('error', err);
        res.redirect('/service-watcher/settings')
    });
});

router.get('/new', (req, res) => {
    res.render('monitor/create');
});

router.post('/new', schemaValidator(watchedServiceSchema, 'monitor/create'), (req, res, next) => {
    latencyService.create(req.body).then(createdService => {
        req.flash('success', createdService.name+' Created Successfully')
        res.redirect('/service-watcher');
    }).catch(err => {
        res.render('monitor/create', { errors: [err], oldValues: req.body })
    });
});


router.get('/:id/details', (req, res) => {
    const page = req.query.page ? (parseInt(req.query.page) !== NaN ? parseInt(req.query.page) : 0 ) : 0;
    const pageSize = req.query.pageSize ? (parseInt(req.query.pageSize) !== NaN ? parseInt(req.query.pageSize) : 15 ) : 15;
    latencyService.getPaginatedRequestTimes(req.params.id, page, pageSize).then(resp => {
        res.render('monitor/show', { service: resp.service, paginator: resp.pagination });
    }).catch(err => {
        res.render('monitor/show', { errors: [err] })
    });
});

router.post('/:id/deactivate', (req, res) => {
    const referrer = req.header('Referer') || '/service-watcher';
    latencyService.setActiveStatus(req.params.id, false).then(service => {
        req.flash('success', `${service.name} watch deactivated`);
        res.redirect(referrer);
    }).catch(err => {
        req.flash('error', err);
        res.redirect(referrer);
    });
});

router.post('/:id/activate', (req, res) => {
    const referrer = req.header('Referer') || '/service-watcher';
    latencyService.setActiveStatus(req.params.id, true).then(service => {
        req.flash('success', `${service.name} watch activated`);
        res.redirect(referrer);
    }).catch(err => {
        req.flash('error', err);
        res.redirect(referrer);
    });
});

router.post('/:id/delete', (req, res) => {
    const referrer = req.header('Referer') || '/service-watcher';
    latencyService.destroy(req.params.id).then(() => {
        req.flash('success', `Deleted Successfully`);
        res.redirect(referrer);
    }).catch(err => {
        req.flash('error', err);
        res.redirect(referrer);
    });
});

router.post('/monitoring/stop', (req, res) => {
    const referrer = req.header('Referer') || '/service-watcher';
    if(backgroundService.isRunning()){
        backgroundService.stop();
        req.flash('success', `Service Watcher has been paused`);
        res.redirect(referrer);
    } else {
        req.flash('success', `Service Watcher is not running`);
        res.redirect(referrer);
    }
});

router.post('/monitoring/start', (req, res) => {
    const referrer = req.header('Referer') || '/service-watcher';
    if(!backgroundService.isRunning()){
        latencyService.getSettings().then(setting => {
            if(!setting){
                req.flash('error', `No Polling settings found.. Please create one first`);
                res.redirect(referrer);
            } else {
                backgroundService.start(setting.pollingRate);
                req.flash('success', `Service Watcher has been started...polling every ${setting.pollingRate / 1000} seconds`);
                res.redirect(referrer);
            }
        }).catch(err => {
            req.flash('error', err);
            res.redirect(referrer);
        })
        
    } else {
        req.flash('error', `Service Watcher is already running`);
        res.redirect(referrer);
    }
});

module.exports = router;
