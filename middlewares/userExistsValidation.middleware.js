import { connectionDB } from "../database/db.js";

export async function userExistsValidation(req, res, next) {
  const { email } = res.locals.user;

  try {
    const { rows } = await connectionDB.query(
      "SELECT * FROM users WHERE email=$1;",
      [email]
    );

    if (rows.length !== 0) {
      return res.sendStatus(409);
    }

    next();
  } catch (error) {
    res.status(500).send(error.message);
  }
}