import * as Joi from 'joi';

export const updateValidation = Joi.object({
  name: Joi.string(),
  about: Joi.string(),
  avatar: Joi.string(),
  online: Joi.boolean(),
  status: Joi.number(),
});
