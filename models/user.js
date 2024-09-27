const { Schema, model } = require("mongoose");
const Joi = require("@hapi/joi");

const { handleMongooseError } = require("../helpers");

const emailRegexp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    token: {
      type: String,
      default: null,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

const registerSchema = Joi.object({
  username: Joi.string().max(21).required().empty().messages({
    "string.empty": `Username cannot be an empty field`,
    "any.required": `missing required Username field`,
  }),
  email: Joi.string().pattern(emailRegexp).required().empty().messages({
    "string.empty": `EMAIL cannot be an empty field`,
    "any.required": `missing required EMAIL field`,
  }),
  password: Joi.string().min(6).required().empty().messages({
    "string.empty": `PASSWORD cannot be an empty field`,
    "string.min": `PASSWORD should have a minimum length of {#limit}`,
    "any.required": `missing required PASSWORD field`,
  }),
});

const emailSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).empty().required().messages({
    "string.empty": `EMAIL cannot be an empty field`,
    "any.required": `missing required field EMAIL`,
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().empty().messages({
    "string.empty": `EMAIL cannot be an empty field`,
    "any.required": `missing required EMAIL field`,
  }),
  password: Joi.string().required().empty().min(6).messages({
    "string.empty": `PASSWORD cannot be an empty field`,
    "string.min": `PASSWORD should have a minimum length of {#limit}`,
    "any.required": `missing required PASSWORD field`,
  }),
});

const schemas = {
  registerSchema,
  emailSchema,
  loginSchema,
};

const User = model("user", userSchema);

module.exports = {
  User,
  schemas,
};
