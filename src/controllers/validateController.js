const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Joi = require('joi');

exports.validateLogin = catchAsync(async (req, res, next) => {
  const loginPayload = req.body;
  try {
    await loginValidate.validateAsync(loginPayload);
    next();
  } catch (err) {
    return next(new AppError(err.details[0].message, 406));
  }
});

const loginValidate = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string().min(8).required()
}).with('email', 'password')
