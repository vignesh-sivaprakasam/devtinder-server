const mongoose = require("mongoose");

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
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate() {
        const validGenders = ["male", "female", "other"];
        if (!validGenders.includes(this.gender)) {
          throw new Error(
            `Invalid gender value: ${this.gender}. Valid values are: ${validGenders.join(", ")}`,
          );
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://www.pngfind.com/pngs/m/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.png",
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

const User = mongoose.model("User", userSchema);
module.exports = User;
