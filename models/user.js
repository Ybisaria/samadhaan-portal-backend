const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema( //{
  // username: { type: String, required: true, unique: true },
  // password: { type: String, required: true },
  //}
  {
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
