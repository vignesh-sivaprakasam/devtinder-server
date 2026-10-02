const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  console.log(firstName.length, "Validating sign-up data:", {
    firstName,
    lastName,
    emailId,
    password,
  });
  if (!firstName || !lastName) {
    throw new Error("First name and last name are required");
  } else if (firstName.length < 4 || firstName.length > 50) {
    throw new Error("First name must be between 4 and 50 characters");
  } else if (lastName.length < 1 || lastName.length > 50) {
    throw new Error("Last name must be between 4 and 50 characters");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Please provide a valid email address");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character",
    );
  }
};

const validateProfileEditData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "photoUrl",
    "about",
    "skills",
  ];

  console.log(
    "req.body : ",
    req.body,
    " Object.keys(req.body) :",
    Object.keys(req.body),
  );
  const isValidField = Object.keys(req.body).every((field) => {
    console.log(
      "field : ",
      field,
      "allowedEditFields.includes(field) : ",
      allowedEditFields.includes(field),
    );
    return allowedEditFields.includes(field);
  });
  if (!isValidField) {
    return false;
  }

  const { firstName, lastName, age, gender, photoUrl, about, skills } =
    req.body;

  // Validate each field if provided
  if (firstName && (firstName.length < 4 || firstName.length > 50)) {
    throw new Error("First name must be between 4 and 50 characters");
  }
  if (lastName && (lastName.length < 1 || lastName.length > 50)) {
    throw new Error("Last name must be between 4 and 50 characters");
  }
  if (age && (age < 0 || age > 150)) {
    throw new Error("Age must be a positive number between 0 and 150");
  }
  if (gender && !["male", "female", "other"].includes(gender)) {
    throw new Error(
      "Invalid gender. Please choose from 'male', 'female', or 'other'",
    );
  }
  if (photoUrl && !validator.isURL(photoUrl)) {
    throw new Error("Please provide a valid photo URL");
  }

  return true; // All validations passed
};

const validateProfilePasswordData = (req) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    throw new Error("Current password and new password are required");
  }

  if (!validator.isStrongPassword(newPassword)) {
    throw new Error(
      "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character",
    );
  }
  return true; // All validations passed
};

module.exports = {
  validateSignUpData,
  validateProfileEditData,
  validateProfilePasswordData,
};
