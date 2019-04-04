const _ = require('lodash');
const Joi = require('joi');

module.exports = (schema, render) => {
    const _validationOptions = {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true
    };

    return (req, res, next) => {
        if (schema) {
            return Joi.validate(req.body, schema, _validationOptions, (err, data) => {
                if (err) {
                    const validationErrors = _.map(err.details, ({message, type}) => ({
                                message: message.replace(/['"]/g, ''),
                                type
                            }));

                    if(render){
                        res.render(render, { errors: validationErrors, oldValues: data });
                    } else {
                        backURL=req.header('Referer') || '/';
                        req.flash('errors', validationErrors);
                        res.redirect(backURL);
                    }
                } else {
                    req.body = data;
                    next();
                }

            });
        }
        next();
    };
};