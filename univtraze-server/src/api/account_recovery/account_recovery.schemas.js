const Joi = require('joi');

module.exports = {
  sendUserRecoveryCodeSchema: Joi.object({
    email: Joi.string().email().required(),
  }),
  changeUserPasswordViaRecoveryCodeSchema: Joi.object({
    email: Joi.string().email().required(),
    recovery_password: Joi.string().required(),
    new_password: Joi.string().required(),
  }),
};
