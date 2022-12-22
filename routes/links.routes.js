import { Router } from "express";
import { urlSchemaValidation } from "../middlewares/urlSchemaValidation.middleware.js";
import { userTokenValidation } from "../middlewares/userTokenValidation.middleware.js";
import { shortenLink, getLinkById, openUrl, deleteLink } from "../controllers/links.controllers.js";

const router = Router();

router.post("/urls/shorten", urlSchemaValidation, userTokenValidation, shortenLink);
router.get("/urls/:id", getLinkById);
router.get("/urls/open/:shortUrl", openUrl);
router.delete("/urls/:id", userTokenValidation, deleteLink);

export default router;