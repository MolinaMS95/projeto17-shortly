import { connectionDB } from "../database/db.js";
import { nanoid } from "nanoid";

export async function shortenLink(req, res) {
  const url = res.locals.url;
  const shortUrl = nanoid();
  const user = res.locals.user;

  try {
    await connectionDB.query(
      "INSERT INTO links (user_id, url, shortUrl) VALUES ($1, $2, $3);",
      [user.id, url.url, shortUrl]
    );
    res.status(201).send({ shortUrl });
  } catch (error) {
    res.status(500).send(error.message);
  }
}
