import { connectionDB } from "../database/db.js";
import { nanoid } from "nanoid";

export async function shortenLink(req, res) {
  const url = res.locals.url;
  const shortUrl = nanoid();
  const user = res.locals.user;

  try {
    await connectionDB.query(
      `INSERT INTO links (user_id, url, "shortUrl") VALUES ($1, $2, $3);`,
      [user.id, url.url, shortUrl]
    );
    res.status(201).send({ shortUrl });
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function getLinkById(req, res) {
  const { id } = req.params;

  try {
    const { rows } = await connectionDB.query(
      `SELECT id, "shortUrl", url FROM links WHERE id=$1;`,
      [id]
    );

    if (rows.length === 0) {
      return res.sendStatus(404);
    }

    return res.status(200).send(rows[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
