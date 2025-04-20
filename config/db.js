const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://yashbisaria1:yashbisaria1@cluster0.ugcqh8w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );

    console.log(" MONGO DB CONNECTED ");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
module.exports = connectDB;
