import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { userRepository } from "../repositories/userRepository.js";
import { roleRepository } from "../repositories/roleRepository.js";
import { gradeRepository } from "../repositories/gradeRepository.js";
import { subjectRepository } from "../repositories/subjectRepository.js";
import { notificationRepository } from "../repositories/notificationRepository.js";
import { emailService } from "./emailService.js";

const generateToken = (payload) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured.");
  }
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  return jwt.sign(payload, secret, { expiresIn });
};

export const authService = {
  async registerStudent({ name, email, password, grade_id }) {
    // 1. Validation
    if (!name || name.trim().length < 2) {
      const error = new Error("Full name is required (minimum 2 characters).");
      error.statusCode = 400;
      throw error;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      const error = new Error("Please provide a valid email address.");
      error.statusCode = 400;
      throw error;
    }

    if (!password || password.length < 8) {
      const error = new Error("Password must be at least 8 characters long.");
      error.statusCode = 400;
      throw error;
    }

    // Validate grade_id if provided
    let verifiedGradeId = null;
    if (grade_id) {
      const grade = await gradeRepository.findById(Number(grade_id));
      if (!grade) {
        const error = new Error("Selected grade is invalid.");
        error.statusCode = 400;
        throw error;
      }
      verifiedGradeId = grade.grade_id;
    }

    // 2. Check for duplicate email
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      const error = new Error("An account with this email address already exists.");
      error.statusCode = 409;
      throw error;
    }

    // 3. Ensure STUDENT role exists
    const studentRole = await roleRepository.findByName("STUDENT");
    if (!studentRole) {
      const error = new Error("STUDENT role not found in system.");
      error.statusCode = 500;
      throw error;
    }

    // 4. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenHash = crypto.createHash("sha256").update(verificationToken).digest("hex");
    const verificationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // 5. Create user
    const newUser = await userRepository.create({
      role_id: studentRole.role_id,
      grade_id: verifiedGradeId,
      name: name.trim(),
      email: email.trim(),
      password: hashedPassword,
      verification_token_hash: verificationTokenHash,
      verification_expires_at: verificationExpiresAt,
    });

    // 6. If grade was provided, auto-subscribe student to subjects in that grade
    if (verifiedGradeId) {
      try {
        const subjects = await subjectRepository.findAll({ gradeId: verifiedGradeId });
        for (const subject of subjects) {
          await notificationRepository.setPreference(newUser.user_id, subject.subject_id, true);
        }
      } catch (prefErr) {
        console.warn("Non-fatal: failed to set default notification preferences:", prefErr.message);
      }
    }

    try {
      await emailService.sendVerificationEmail({
        name: newUser.name,
        email: newUser.email,
        token: verificationToken,
      });
    } catch (emailError) {
      console.error("Verification email delivery failed:", emailError.message);
      await userRepository.delete(newUser.user_id);
      const error = new Error(
        process.env.NODE_ENV === "development"
          ? `We could not send the verification email: ${emailError.message}`
          : "We could not send the verification email. Please try again later."
      );
      error.statusCode = 503;
      throw error;
    }

    return {
      user: newUser.toSafeObject(),
      message: "Account created. Please check your email to verify your account before logging in.",
    };
  },

  async login({ email, password }) {
    if (!email || !password) {
      const error = new Error("Email and password are required.");
      error.statusCode = 400;
      throw error;
    }

    const user = await userRepository.findByEmail(email);
    if (!user) {
      const error = new Error("Invalid email or password.");
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error("Invalid email or password.");
      error.statusCode = 401;
      throw error;
    }

    if (user.role_name === "STUDENT" && !user.email_verified_at) {
      const error = new Error("Please verify your email address before logging in.");
      error.statusCode = 403;
      throw error;
    }

    const token = generateToken({
      user_id: user.user_id,
      email: user.email,
      role: user.role_name,
      name: user.name,
      grade_id: user.grade_id,
    });

    return {
      user: user.toSafeObject(),
      token,
    };
  },

  async verifyEmail(token) {
    if (!token) {
      const error = new Error("Verification token is required.");
      error.statusCode = 400;
      throw error;
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const verifiedUser = await userRepository.verifyEmail(tokenHash);
    if (!verifiedUser) {
      const error = new Error("This verification link is invalid or expired.");
      error.statusCode = 400;
      throw error;
    }

    return { message: "Email verified successfully. You can now log in." };
  },

  async getMe(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }
    return user.toSafeObject();
  },
};
