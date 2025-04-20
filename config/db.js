const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://guptatejasv86086:IHiNa09sVQaCgM9N@cluster0.6etxq2u.mongodb.net/InvertisCare_db?retryWrites=true&w=majority&appName=Cluster0"
    );

    console.log(" MONGO DB CONNECTED ");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
module.exports = connectDB;
