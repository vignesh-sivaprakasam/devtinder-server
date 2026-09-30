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

module.exports = { validateSignUpData };
