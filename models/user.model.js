import joi from "joi";

export const usersSchema = joi.object({
  name: joi.string().required().min(3),
  email: joi.string().email().required(),
  password: joi.string().required(),
  confirmPassword: joi.any().equal(joi.ref("password")).required(),
});
