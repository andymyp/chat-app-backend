import * as Joi from 'joi';

export const signUpValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const signInValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const signInOAValidation = Joi.object({
  name: Joi.string().required(),
  about: Joi.string(),
  email: Joi.string().email().required(),
  avatar: Joi.string(),
});

export const resendOtpValidation = Joi.object({
  email: Joi.string().email().required(),
});

export const verifyValidation = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().required(),
});

export const forgotPassValidation = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPassValidation = Joi.object({
  password: Joi.string().min(6).required(),
});
