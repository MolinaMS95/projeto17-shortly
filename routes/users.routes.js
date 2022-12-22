import { Router } from "express";
import { userSchemaValidation } from "../middlewares/userSchemaValidation.middleware.js";
import { userExistsValidation } from "../middlewares/userExistsValidation.middleware.js";
import { signUp } from "../controllers/users.controllers.js";

const router = Router();

router.post("/signup", userSchemaValidation, userExistsValidation, signUp);

export default router;
