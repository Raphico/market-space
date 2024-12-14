import { Router } from "express";
import { resendEmailVerification } from "../controllers/auth/resend-email-verification.controller.js";
import { signup } from "../controllers/auth/signup.controller.js";
import { verifyEmail } from "../controllers/auth/verify-email.controller.js";

const router = Router();

router.post("/signup", signup);
router.get("/verify-email/:verificationToken", verifyEmail);
router.post("/resend-email-verification", resendEmailVerification);

export default router;