// src/utils/validators.js

/**
 * Individual field validators
 * Each returns an error string or null if valid
 */

export const validateFullName = (value) => {
  if (!value?.trim()) return "Full name is required";
  if (value.trim().length < 2) return "Name must be at least 2 characters";
  return null;
};

export const validateEmail = (value) => {
  if (!value?.trim()) return "Email is required";
  if (!/\S+@\S+\.\S+/.test(value)) return "Enter a valid email address";
  return null;
};

export const validatePhone = (value) => {
  if (!value?.trim()) return "Mobile number is required";
  if (!/^\d{10}$/.test(value.trim()))
    return "Enter exactly 10 digits, no spaces or symbols";
  return null;
};

export const validatePassword = (value) => {
  if (!value) return "Password is required";
  if (value.length < 6) return "At least 6 characters required";
  return null;
};

export const validateAmount = (value) => {
  if (!value) return "Amount is required";
  if (isNaN(parseFloat(value)) || parseFloat(value) <= 0)
    return "Enter a valid amount greater than 0";
  return null;
};

export const validateCategory = (value) => {
  if (!value) return "Please select a category";
  return null;
};

export const validateRequired = (value, fieldName = "This field") => {
  if (!value?.trim()) return `${fieldName} is required`;
  return null;
};

// ─────────────────────────────────────────────────────────────────────────────
/**
 * Form-level validators
 * Each returns an errors object — key = field name, value = error string
 * Empty object {} means all valid
 */

export const validateLoginForm = ({ email, password }) => {
  const errors = {};
  const emailErr = validateEmail(email);
  const passwordErr = validatePassword(password);
  if (emailErr) errors.email = emailErr;
  if (passwordErr) errors.password = passwordErr;
  return errors;
};

export const validateSignUpForm = ({ fullName, phone, email, password }) => {
  const errors = {};
  const nameErr = validateFullName(fullName);
  const phoneErr = validatePhone(phone);
  const emailErr = validateEmail(email);
  const passwordErr = validatePassword(password);
  if (nameErr) errors.fullName = nameErr;
  if (phoneErr) errors.phone = phoneErr;
  if (emailErr) errors.email = emailErr;
  if (passwordErr) errors.password = passwordErr;
  return errors;
};

export const validateTransactionForm = ({ amount, category, type }) => {
  const errors = {};
  const amountErr = validateAmount(amount);
  if (amountErr) errors.amount = amountErr;
  // Category not required for transfer type
  if (type !== "transfer") {
    const categoryErr = validateCategory(category);
    if (categoryErr) errors.category = categoryErr;
  }
  return errors;
};

export const validateEditProfileForm = ({ fullName, phone, email }) => {
  const errors = {};
  const nameErr = validateFullName(fullName);
  const phoneErr = validatePhone(phone);
  const emailErr = validateEmail(email);
  if (nameErr) errors.fullName = nameErr;
  if (phoneErr) errors.phone = phoneErr;
  if (emailErr) errors.email = emailErr;
  return errors;
};

// ─────────────────────────────────────────────────────────────────────────────
/**
 * Helper — checks if an errors object has any errors
 * Usage: if (hasErrors(errors)) return;
 */
export const hasErrors = (errors) => Object.keys(errors).length > 0;
