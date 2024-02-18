const Joi = require('joi');

module.exports = {
  addVaccineRecordSchema: Joi.object({
    user_id: Joi.number().required(),
    vaccine_disease: Joi.string().required(),
    vaccine_name: Joi.string().required(),
    dose_number: Joi.string().required(),
    date: Joi.date().iso().required(),
  }),
  updateVaccineRecordSchema: Joi.object({
    vaccination_record_id: Joi.number().required(),
    user_id: Joi.number().required(),
    vaccine_disease: Joi.string().required(),
    vaccine_name: Joi.string().required(),
    dose_number: Joi.string().required(),
    date: Joi.date().iso().required(),
  }),
  deleteVaccinationRecordSchema: Joi.object({
    vaccination_record_id: Joi.number().required(),
  }),
};
