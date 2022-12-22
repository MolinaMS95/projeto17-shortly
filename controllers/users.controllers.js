import { connectionDB } from "../database/db.js";
import bcrypt from "bcrypt";
import { v4 as uuidV4 } from "uuid";

export async function signUp(req, res) {
  const { name, email, password } = res.locals.user;
  const hashPassword = bcrypt.hashSync(password, 10);

  try {
    await connectionDB.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3);",
      [name, email, hashPassword]
    );
    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function signIn(req, res) {
  const user = res.locals.user;
  const token = uuidV4();

  try {
    const { rows } = await connectionDB.query(
      "SELECT * FROM sessions WHERE user_id = $1;",
      [user.id]
    );

    if (rows.length !== 0) {
      await connectionDB.query(
        "UPDATE sessions SET token=$1 WHERE user_id=$2;",
        [token, user.id]
      );
    }

    await connectionDB.query(
      "INSERT INTO sessions (user_id, token) VALUES ($1, $2);",
      [user.id, token]
    );
    res.status(200).send(token);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function getUser(req, res) {
  const user = res.locals.user;

  try {
    const { rows } = await connectionDB.query(
      `SELECT 
        JSON_BUILD_OBJECT('id', users.id, 
                          'name', users.name, 
                          "visitCount", sum(links."visitCount"),
                          "shortenedUrls", JSON_BUILD_OBJECT(
                            'id', links.id,
                            "shortUrl", links."shortUrl", 
                            'url', links.url, 
                            "visitCount", links."visitCount")) 
       FROM users JOIN links ON users.id = links.user_id,
       WHERE users.id = $1
       GROUP BY users.id;`,
      [user.id]
    );

    res.status(200).send(rows[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
