const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Complaint = require("../models/complaint");

// 🗂️ Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// 📬 POST /complaints - Handle complaint form submission
router.post("/", upload.single("proof"), async (req, res) => {
  console.log("Form Data Received:", req.body);
  console.log("File Info:", req.file);
  try {
    const {
      category,
      teacherName,
      teacherCourse,
      teacherSemester,
      teacherIssueDesc,
      academicCourse,
      academicSemester,
      academicDesc,
      otherDesc,
      email,
    } = req.body;

    const complaintData = {
      category,
      email,
      proofFileName: req.file?.filename || "",
    };

    // Handle fields based on category
    if (category === "Teacher Issues") {
      complaintData.teacherName = teacherName;
      complaintData.course = teacherCourse;
      complaintData.semester = teacherSemester;
      complaintData.teacherIssueDesc = teacherIssueDesc;
    } else if (category === "Academic Issues") {
      complaintData.course = academicCourse;
      complaintData.semester = academicSemester;
      complaintData.academicDesc = academicDesc;
    } else {
      complaintData.otherDesc = otherDesc;
    }

    // Save to database
    const complaint = new Complaint(complaintData);
    await complaint.save();

    res.status(200).send("Complaint submitted successfully!");
  } catch (err) {
    console.error("Complaint submission error:", err);
    res.status(500).send("Server error while submitting complaint");
  }
});

module.exports = router;

// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const path = require("path");
// const nodemailer = require("nodemailer");
// const Complaint = require("../models/complaint");

// // Get email and password from command-line arguments
// const email = process.argv
//   .find((arg) => arg.startsWith("--email="))
//   ?.split("=")[1];
// const password = process.argv
//   .find((arg) => arg.startsWith("--password="))
//   ?.split("=")[1];

// if (!email || !password) {
//   throw new Error("Email and password are required as command-line arguments.");
// }

// // 📂 Multer setup for file uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/"); // Make sure this folder exists
//   },
//   filename: function (req, file, cb) {
//     const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueName + path.extname(file.originalname));
//   },
// });

// const upload = multer({ storage: storage });

// // 📧 Nodemailer transporter setup using command-line arguments
// const transporter = nodemailer.createTransport({
//   service: "Gmail",
//   auth: {
//     user: email, // Email from command-line argument
//     pass: password, // Password from command-line argument
//   },
// });

// // 📬 POST route to handle complaint submission
// router.post("/", upload.single("proof"), async (req, res) => {
//   console.log("Form Data Received:", req.body);
//   console.log("File Info:", req.file);

//   try {
//     const {
//       category,
//       teacherName,
//       teacherCourse,
//       teacherSemester,
//       teacherIssueDesc,
//       academicCourse,
//       academicSemester,
//       academicDesc,
//       otherDesc,
//       userEmail,
//     } = req.body;

//     // 📦 Build complaint data
//     const complaintData = {
//       category,
//       email: userEmail,
//       proofFileName: req.file?.filename || "",
//     };

//     if (category === "Teacher Issues") {
//       complaintData.teacherName = teacherName;
//       complaintData.course = teacherCourse;
//       complaintData.semester = teacherSemester;
//       complaintData.teacherIssueDesc = teacherIssueDesc;
//     } else if (category === "Academic Issues") {
//       complaintData.course = academicCourse;
//       complaintData.semester = academicSemester;
//       complaintData.academicDesc = academicDesc;
//     } else {
//       complaintData.otherDesc = otherDesc;
//     }

//     // 💾 Save to database
//     const complaint = new Complaint(complaintData);
//     await complaint.save();

//     // 📤 Email confirmation to user
//     const mailOptions = {
//       from: email, // From the email passed in the command-line arguments
//       to: userEmail,
//       subject: "Complaint Received",
//       text: `Hello,

// We have received your complaint under the category: ${category}.
// We appreciate you reaching out and will get back to you soon.

// Best regards,
// Complaint Desk`,
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.error("Email send error:", error);
//       } else {
//         console.log("Email sent:", info.response);
//       }
//     });

//     res.status(200).send("Complaint submitted successfully!");
//   } catch (err) {
//     console.error("Complaint submission error:", err);
//     res.status(500).send("Server error while submitting complaint");
//   }
// });

// module.exports = router;
