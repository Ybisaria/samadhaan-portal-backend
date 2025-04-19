const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema( //{
  // username: { type: String, required: true, unique: true },
  // password: { type: String, required: true },
  //}
  {
    studentId: {
      type: String,
      //required: true,
      unique: true,
    },
    username: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple nulls but enforces uniqueness for actual values
    },
    email: {
      type: String,
      //required: true,
      unique: true,
      match: [/.+\@.+\..+/, "Please enter a valid email"],
    },
    password: {
      type: String,
      //required: true,
      select: false,
    },
    phone: {
      type: String,
    },
    course: {
      type: String,
    },
    year: {
      type: String,
    },
    dob: {
      type: Date,
    },
    photo: {
      type: String,
      default: "default.jpg",
    },
    name: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
module.exports = mongoose.model("user", UserSchema);
//
