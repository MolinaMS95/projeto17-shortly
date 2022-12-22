import { Router } from "express";
import { urlSchemaValidation } from "../middlewares/urlSchemaValidation.middleware.js";
import { userTokenValidation } from "../middlewares/userTokenValidation.middleware.js";
import { shortenLink, getLinkById } from "../controllers/links.controllers.js";

const router = Router();

router.post("/urls/shorten", urlSchemaValidation, userTokenValidation, shortenLink);
router.get("/urls/:id", getLinkById);

export default router;