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
      return res.status(200).send(token);;
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
      `SELECT users.id, users.name, SUM(links."visitCount") AS "visitCount",
              JSON_AGG(JSON_BUILD_OBJECT('id', links.id,
                                         'shortUrl', links."shortUrl", 
                                         'url', links.url, 
                                         'visitCount', links."visitCount")) AS "shortenedUrls"
       FROM users LEFT JOIN links ON users.id = links.user_id
       WHERE users.id = $1
       GROUP BY users.id;`,
      [user.id]
    );

    res.status(200).send(rows[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function topUsers(req, res) {
  try {
    const { rows } = await connectionDB.query(
      `SELECT users.id, users.name, COALESCE(COUNT(links.url), 0) AS "linksCount", COALESCE(SUM(links."visitCount"), 0) AS "visitCount"
       FROM users LEFT JOIN links ON users.id = links.user_id
       GROUP BY users.id
       ORDER BY "visitCount" DESC
       LIMIT 10`
    );

    res.status(200).send(rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
