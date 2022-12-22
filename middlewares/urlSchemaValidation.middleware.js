import { urlSchema } from "../models/url.model.js";

export function urlSchemaValidation(req, res, next) {
  const url = req.body;

  const { error } = urlSchema.validate(url, { abortEarly: false });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(422).send(errors);
  }

  res.locals.url = url;

  next();
}