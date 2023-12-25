const Joi = require('joi');

class Schemas {
  get signupSchema() {
    return Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
      confirmPassword: Joi.ref('password'),
    })
      .with('password', 'confirmPassword')
      .messages({
        'any.required': '{{#label}} is required',
        'string.empty': '{{#label}} cannot be empty',
        'string.min': '{{#label}} must be at least {{#limit}} characters long',
        'string.max': '{{#label}} must be at most {{#limit}} characters long',
        'string.email': 'Please enter a valid email address',
        'any.only': '{{#label}} does not match',
        'string.pattern.base': '{{#label}} must be alphanumeric with no special characters',
      });
  }
}

module.exports = new Schemas();
