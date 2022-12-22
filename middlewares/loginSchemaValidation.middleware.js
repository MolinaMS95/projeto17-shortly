import { loginSchema } from "../models/login.model.js";

export function loginSchemaValidation(req, res, next) {
  const user = req.body;

  const { error } = loginSchema.validate(user, { abortEarly: false });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(422).send(errors);
  }

  res.locals.user = user;

  next();
}