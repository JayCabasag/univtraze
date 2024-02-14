const Joi = require('joi');

module.exports = {
  addKioskScanSchema: Joi.object({
    temperature: Joi.number().required(),
    room_id: Joi.number().required(),
    user_id: Joi.number().required(),
    sensor_device: Joi.string().required(),
    unit_of_measurement: Joi.string().required(),
    remarks: Joi.string().required(),
  }),
  getKioskUserByIdSchema: Joi.object({
    user_id: Joi.number().required(),
  }),
};
