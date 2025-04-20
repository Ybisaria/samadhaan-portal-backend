const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const path = require("path");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");

const app = express();
connectDB();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "samadhanSecret",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://yashbisaria1:yashbisaria1@cluster0.nowe0ga.mongodb.net/samadhan_db?retryWrites=true&w=majority&appName=Cluster0",
    }),
  })
);

// Serve frontend static files
app.use(express.static(path.join(__dirname, "../frontend")));

// Auth Routes
app.use("/", authRoutes);

// complaint route
const complaintRoutes = require("./routes/submitComplaint");

app.use("/complaints", complaintRoutes);

// Middleware to protect routes
function isAuthenticated(req, res, next) {
  if (req.session.user) return next();
  res.redirect("/login.html");
}

// Example protected route
app.get("/home.html", isAuthenticated, (req, res, next) => {
  next();
});

// Start server
const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
