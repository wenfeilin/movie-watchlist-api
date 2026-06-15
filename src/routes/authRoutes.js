import express from "express";
import { register, login, logout } from "../controllers/authController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { registerSchema, loginSchema } from "../validators/authValidators.js";

const router = express.Router();

// These are all POST b/c you're sending credentials and/or causing an auth action (changes server/client auth state --> cookie), so not GET

// To register new user (creating = POST) = create user in db table; can also be "/signup"
router.post("/register", validateRequest(registerSchema), register);

router.post("/login", validateRequest(loginSchema), login);

router.post("/logout", logout);

export default router;
