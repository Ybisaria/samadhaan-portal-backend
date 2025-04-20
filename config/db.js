const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://yashbisaria1:XmNBmQ0o2TbrK2f7@cluster0.nowe0ga.mongodb.net/samadhan_db?retryWrites=true&w=majority&appName=Cluster0"
    );

    console.log(" MONGO DB CONNECTED ");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
module.exports = connectDB;
