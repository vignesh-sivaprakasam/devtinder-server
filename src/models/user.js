const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const validator = require("validator");

const SECRET_KEY = "DEV@TINDER$123";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
    },
    emailId: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email format");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is not strong enough");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: "{VALUE} is incorrect gender.",
      },
      // validate() {
      //   const validGenders = ["male", "female", "other"];
      //   if (!validGenders.includes(this.gender)) {
      //     throw new Error(
      //       `Invalid gender value: ${this.gender}. Valid values are: ${validGenders.join(", ")}`,
      //     );
      //   }
      // },
    },
    photoUrl: {
      type: String,
      default:
        "https://www.pngfind.com/pngs/m/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL format");
        }
      },
    },
    about: {
      type: String,
      default: "This is a default about of the user.",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign({ userId: user._id }, SECRET_KEY, {
    expiresIn: "7d",
  });

  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  return bcrypt.compare(passwordInputByUser, user.password);
};

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
