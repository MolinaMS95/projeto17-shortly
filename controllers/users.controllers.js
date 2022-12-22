import { connectionDB } from "../database/db.js";
import bcrypt from "bcrypt";

export async function signUp(req, res) {
  const { name, email, password } = res.locals.user;
  const hashPassword = bcrypt.hashSync(user.password, 10);

  try {
    await connectionDB.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3);",
      [name, email, password]
    );
    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
