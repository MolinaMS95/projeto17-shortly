import { Router } from "express";
import { userSchemaValidation } from "../middlewares/userSchemaValidation.middleware.js";
import { userExistsValidation } from "../middlewares/userExistsValidation.middleware.js";
import { loginSchemaValidation } from "../middlewares/loginSchemaValidation.middleware.js";
import { signInValidation } from "../middlewares/signInValidation.middleware.js";
import { userTokenValidation } from "../middlewares/userTokenValidation.middleware.js";
import { signUp, signIn, getUser, topUsers } from "../controllers/users.controllers.js";

const router = Router();

router.post("/signup", userSchemaValidation, userExistsValidation, signUp);
router.post("/signin", loginSchemaValidation, signInValidation, signIn);
router.get("/users/me", userTokenValidation, getUser);
router.get("/ranking", topUsers);

export default router;
