const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://yashbisaria1:<db_password>@cluster0.nowe0ga.mongodb.net/"
    );

    console.log(" MONGO DB CONNECTED ");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
module.exports = connectDB;
