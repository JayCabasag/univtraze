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
      type: Joi.string().required(),
      user_id: Joi.number().required(),
      firstname: Joi.string().required(),
      lastname: Joi.string().required(),
      middlename: Joi.string().allow(''),
      suffix: Joi.string().allow(''),
      gender: Joi.string().required(),
      address: Joi.string().required(),
      course: Joi.string().required(),
      year_section: Joi.string().required(),
      birthday: Joi.date().iso().required(),
      student_id: Joi.string().required(),
      mobile_number: Joi.string().required(),
      email: Joi.string().email().required(),
      profile_url: Joi.string().uri().allow(null),
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

  get addEmployeeDetails() {
    return Joi.object({
      type: Joi.string().required(),
      user_id: Joi.number().required(),
      firstname: Joi.string().required(),
      lastname: Joi.string().required(),
      middlename: Joi.string().allow(''),
      suffix: Joi.string().allow(''),
      gender: Joi.string().required(),
      address: Joi.string().required(),
      department: Joi.string().required(),
      position: Joi.string().required(),
      birthday: Joi.date().iso().required(),
      employee_id: Joi.string().required(),
      mobile_number: Joi.string().required(),
      email: Joi.string().email().required(),
      profile_url: Joi.string().uri().allow(null),
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
      type: Joi.string().required(),
      user_id: Joi.number().required(),
      firstname: Joi.string().required(),
      lastname: Joi.string().required(),
      middlename: Joi.string().allow(''),
      suffix: Joi.string().allow(''),
      gender: Joi.string().required(),
      address: Joi.string().required(),
      birthday: Joi.date().iso().required(),
      email: Joi.string().email().required(),
      mobile_number: Joi.string().required(),
      profile_url: Joi.string().uri().allow(null),
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

  get updateUserTypeSchema() {
    return Joi.object({
      type: Joi.string().required(),
    }).messages({
      'string.empty': '{{#label}} cannot be empty',
    });
  }

  get userIdSchema() {
    return Joi.object({
      userId: Joi.number().required(),
    }).messages({
      'string.empty': '{{#label}} cannot be empty',
    });
  }

  get addTempHistorySchema() {
    return Joi.object({
      user_id: Joi.number().integer().positive().required(),
      temperature: Joi.number().required(),
      unit_of_measurement: Joi.string().required(),
      room_id: Joi.number().integer().positive().required(),
      sensor_device: Joi.string().required(),
      remarks: Joi.string().allow('').optional(),
    });
  }

  get loginAdminSchema() {
    return Joi.object({
      username: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    });
  }

  get createAdminSchema() {
    return Joi.object({
      username: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    });
  }

  get addRoomShema() {
    return Joi.object({
      room_number: Joi.number().required(),
      building_name: Joi.string().required(),
      room_name: Joi.string().required(),
    });
  }

  get addVisitedRoomSchema() {
    return Joi.object({
      user_id: Joi.number().required(),
      room_id: Joi.number().required(),
      temperature: Joi.any().required(),
    });
  }
}

module.exports = new Schemas();
