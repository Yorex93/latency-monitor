const Joi = require('joi');

const registerSchema = Joi.object().keys({
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    password: Joi.string().required(),
    passwordConfirm: Joi.any().valid(Joi.ref('password')).required().options({ language: { any: { allowOnly: 'Must match password' } } }),
    phone: Joi.string(),
    firstName: Joi.string().alphanum().min(1).max(50).required(),
    lastName: Joi.string().alphanum().min(1).max(50).required(),
});

const loginSchema = Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required()
});

const watchedServiceSchema = Joi.object().keys({
    endpoint: Joi.string().uri(),
    name: Joi.string().required(),
});

const settingsSchema = Joi.object().keys({
    pollingRate: Joi.number().required(),
});

module.exports = {
    register: registerSchema,
    login: loginSchema,
    watchedService: watchedServiceSchema,
    settings: settingsSchema
}
