// File: src/features/auth/schemas.js
import { z } from "zod";

// Regular expressions for validation
const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const PASSWORD_REGEX = {
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  number: /[0-9]/,
  special: /[^A-Za-z0-9]/,
};

// Custom error messages
const ERROR_MESSAGES = {
  email: {
    required: "Email is required",
    invalid: "Please enter a valid email address",
  },
  password: {
    required: "Password is required",
    min: "Password must be at least 8 characters",
    uppercase: "Password must contain at least one uppercase letter",
    lowercase: "Password must contain at least one lowercase letter",
    number: "Password must contain at least one number",
    special: "Password must contain at least one special character",
  },
  otp: {
    required: "OTP code is required",
    length: "OTP must be exactly 6 digits",
    numeric: "OTP must contain only numbers",
  },
  confirmPassword: {
    match: "Passwords must match",
  },
};

// Email validation schema
export const emailSchema = z.object({
  email: z
    .string({
      required_error: ERROR_MESSAGES.email.required,
    })
    .email(ERROR_MESSAGES.email.invalid)
    .regex(EMAIL_REGEX, ERROR_MESSAGES.email.invalid),
});

// Login form schema
export const loginSchema = z.object({
  email: z
    .string({
      required_error: ERROR_MESSAGES.email.required,
    })
    .email(ERROR_MESSAGES.email.invalid)
    .regex(EMAIL_REGEX, ERROR_MESSAGES.email.invalid),
  password: z
    .string({
      required_error: ERROR_MESSAGES.password.required,
    })
    .min(1, ERROR_MESSAGES.password.required),
  rememberMe: z.boolean().optional().default(false),
});

// OTP verification schema
export const otpSchema = z.object({
  otp: z
    .string({
      required_error: ERROR_MESSAGES.otp.required,
    })
    .length(6, ERROR_MESSAGES.otp.length)
    .regex(/^\d+$/, ERROR_MESSAGES.otp.numeric),
});

// Password reset schema with confirmation
export const passwordResetSchema = z
  .object({
    password: z
      .string({
        required_error: ERROR_MESSAGES.password.required,
      })
      .min(8, ERROR_MESSAGES.password.min)
      .regex(PASSWORD_REGEX.uppercase, ERROR_MESSAGES.password.uppercase)
      .regex(PASSWORD_REGEX.lowercase, ERROR_MESSAGES.password.lowercase)
      .regex(PASSWORD_REGEX.number, ERROR_MESSAGES.password.number)
      .regex(PASSWORD_REGEX.special, ERROR_MESSAGES.password.special),
    confirmPassword: z.string({
      required_error: ERROR_MESSAGES.password.required,
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: ERROR_MESSAGES.confirmPassword.match,
    path: ["confirmPassword"],
  });

// Helper function to check password strength
export const checkPasswordStrength = (password) => {
  if (!password) return "weak";

  let strength = 0;

  if (password.length >= 8) strength++;
  if (PASSWORD_REGEX.uppercase.test(password)) strength++;
  if (PASSWORD_REGEX.lowercase.test(password)) strength++;
  if (PASSWORD_REGEX.number.test(password)) strength++;
  if (PASSWORD_REGEX.special.test(password)) strength++;

  if (strength <= 2) return "weak";
  if (strength <= 4) return "medium";
  return "strong";
};

// Real-time validation functions
export const validateEmail = (email) => {
  try {
    emailSchema.parse({ email });
    return { isValid: true, error: null };
  } catch (error) {
    return {
      isValid: false,
      error: error.errors[0]?.message || ERROR_MESSAGES.email.invalid,
    };
  }
};

export const validateOTP = (otp) => {
  try {
    otpSchema.parse({ otp });
    return { isValid: true, error: null };
  } catch (error) {
    return {
      isValid: false,
      error: error.errors[0]?.message || ERROR_MESSAGES.otp.length,
    };
  }
};

export const validatePassword = (password, confirmPassword = null) => {
  try {
    if (confirmPassword !== null) {
      passwordResetSchema.parse({ password, confirmPassword });
    } else {
      passwordResetSchema.shape.password.parse(password);
    }
    return { isValid: true, error: null };
  } catch (error) {
    return {
      isValid: false,
      error: error.errors[0]?.message || ERROR_MESSAGES.password.min,
    };
  }
};

// Password requirements helper
export const getPasswordRequirements = (password = "") => {
  return [
    {
      label: "At least 8 characters",
      met: password.length >= 8,
    },
    {
      label: "Contains uppercase letter",
      met: PASSWORD_REGEX.uppercase.test(password),
    },
    {
      label: "Contains lowercase letter",
      met: PASSWORD_REGEX.lowercase.test(password),
    },
    {
      label: "Contains number",
      met: PASSWORD_REGEX.number.test(password),
    },
    {
      label: "Contains special character",
      met: PASSWORD_REGEX.special.test(password),
    },
  ];
};

export default {
  loginSchema,
  emailSchema,
  otpSchema,
  passwordResetSchema,
  validateEmail,
  validateOTP,
  validatePassword,
  checkPasswordStrength,
  getPasswordRequirements,
  ERROR_MESSAGES,
};
