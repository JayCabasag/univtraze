const Joi = require('joi');

module.exports = {
  updateUserProfileSchema: Joi.object({
    profile_url: Joi.string().required(),
    user_id: Joi.number().required(),
    mobile_number: Joi.string()
      .min(7) // Minimum length of the phone number
      .max(15) // Maximum length of the phone number
      .pattern(/^\+\d{1,3}\d{7,14}$/) // Pattern for international phone number format
      .messages({
        'string.base': 'Phone number must be a string',
        'string.empty': 'Phone number cannot be empty',
        'string.min': 'Phone number must have at least {#limit} characters',
        'string.max': 'Phone number must have at most {#limit} characters',
        'string.pattern.base': 'Phone number must be in international format, e.g., +1234567890',
      })
      .required(),
  }),
  changeUserPasswordSchema: Joi.object({
    user_id: Joi.number().required(),
    old_password: Joi.string().required(),
    new_password: Joi.string().required(),
    confirm_password: Joi.string().required(),
  }),
};
