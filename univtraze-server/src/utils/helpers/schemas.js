const Joi = require('joi');

class Schemas {
  get signupSchema() {
    return Joi.object({
      email: Joi.string().email().required(),
      provider: Joi.string().required(),
      password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
      confirm_password: Joi.ref('password'),
    })
      .with('password', 'confirm_password')
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
  get siginSchema() {
    return Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    }).messages({
      'any.required': '{{#label}} is required',
      'string.empty': '{{#label}} cannot be empty',
      'string.min': '{{#label}} must be at least {{#limit}} characters long',
      'string.max': '{{#label}} must be at most {{#limit}} characters long',
      'string.email': 'Please enter a valid email address',
      'any.only': '{{#label}} does not match',
      'string.pattern.base': '{{#label}} must be alphanumeric with no special characters',
    });
  }

  get addStudentDetailsSchema() {
    return Joi.object({
      user_id: Joi.number().required(),
      firstname: Joi.string().required(),
      lastname: Joi.string().required(),
      middlename: Joi.string().allow(''),
      suffix: Joi.string().allow(''),
      gender: Joi.string().valid('rather-not-say', 'male', 'female', 'other').required(),
      address: Joi.string().required(),
      course: Joi.string().required(),
      year_section: Joi.string().required(),
      birthday: Joi.date().iso().required(),
      student_id: Joi.string().required(),
      mobile_number: Joi.string().pattern(new RegExp('^[0-9]{10}$')).required(),
      email: Joi.string().email().required(),
      profile_url: Joi.string().uri(),
      back_id_photo: Joi.string().uri(),
      front_id_photo: Joi.string().uri()
    }).messages({
      'any.required': '{{#label}} is required',
      'string.empty': '{{#label}} cannot be empty',
      'string.email': 'Please enter a valid email address',
      'string.pattern.base': '{{#label}} must be alphanumeric with no special characters',
      'string.pattern.base': '{{#label}} must be a valid URL',
      'date.iso': 'Please enter a valid ISO date format for {{#label}}',
    });
  }

  get addEmployeeDetails() {
    return Joi.object({
      user_id: Joi.number().required(),
      firstname: Joi.string().required(),
      lastname: Joi.string().required(),
      middlename: Joi.string().allow(''),
      suffix: Joi.string().allow(''),
      gender: Joi.string().valid('rather-not-say', 'male', 'female', 'other').required(),
      address: Joi.string().required(),
      department: Joi.string().required(),
      position: Joi.string().required(),
      birthday: Joi.date().iso().required(),
      employee_id: Joi.string().required(),
      mobile_number: Joi.string().pattern(new RegExp('^[0-9]{10}$')).required(),
      email: Joi.string().email().required(),
      profile_url: Joi.string().uri(),
      back_id_photo: Joi.string().uri(),
      front_id_photo: Joi.string().uri(),
    }).messages({
      'any.required': '{{#label}} is required',
      'string.empty': '{{#label}} cannot be empty',
      'string.email': 'Please enter a valid email address',
      'string.pattern.base': '{{#label}} must be alphanumeric with no special characters',
      'string.pattern.base': '{{#label}} must be a valid URL',
      'date.iso': 'Please enter a valid ISO date format for {{#label}}',
    });
  }

  get addVisitorDetails() {
    return Joi.object({
      user_id: Joi.number().required(),
      firstname: Joi.string().required(),
      lastname: Joi.string().required(),
      middlename: Joi.string().allow(''),
      suffix: Joi.string().allow(''),
      gender: Joi.string().valid('rather-not-say', 'male', 'female', 'other').required(),
      address: Joi.string().required(),
      birthday: Joi.date().iso().required(),
      email: Joi.string().email().required(),
      mobile_number: Joi.string().pattern(new RegExp('^[0-9]{10}$')).required(),
      profile_url: Joi.string().allow(null),
      back_id_photo: Joi.string().uri(),
      front_id_photo: Joi.string().uri(),
    }).messages({
      'any.required': '{{#label}} is required',
      'string.empty': '{{#label}} cannot be empty',
      'string.email': 'Please enter a valid email address',
      'string.pattern.base': '{{#label}} must be alphanumeric with no special characters',
      'string.pattern.base': '{{#label}} must be a valid URL',
      'date.iso': 'Please enter a valid ISO date format for {{#label}}',
    });
  }
}

module.exports = new Schemas();
