import { connectionDB } from "../database/db.js";

export async function userTokenValidation(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");
  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const { rows } = await connectionDB.query(
      "SELECT * FROM sessions WHERE token=$1;",
      [token]
    );
    if (rows.length === 0) {
      return res.sendStatus(401);
    }

    const user = await connectionDB.query(
      "SELECT * FROM users WHERE id=$1;",
      [rows[0].user_id]
    );
    if (user.rows.length === 0) {
      return res.sendStatus(401);
    }

    res.locals.user = user.rows[0];

    next();
  } catch (error) {
    res.status(500).send(error.message);
  }
}
