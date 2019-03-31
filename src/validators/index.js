const Joi = require('joi');

const registerSchema = Joi.object().keys({
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    password: Joi.string().required(),
    passwordConfirm: Joi.string().required(),
    phone: Joi.string(),
    firstName: Joi.string().alphanum().min(1).max(50).required(),
    lastName: Joi.string().alphanum().min(1).max(50).required(),
});

const loginSchema = Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required()
});

module.exports = {
    register: registerSchema,
    login: loginSchema
}
