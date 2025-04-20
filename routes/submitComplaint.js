// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const path = require("path");
// const Complaint = require("../models/complaint");

// // 🗂️ Configure Multer for file uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/"); // make sure this folder exists
//   },
//   filename: function (req, file, cb) {
//     const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueName + path.extname(file.originalname));
//   },
// });

// const upload = multer({ storage: storage });

// // 📬 POST /complaints - Handle complaint form submission
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
//       email,
//     } = req.body;

//     const complaintData = {
//       category,
//       email,
//       proofFileName: req.file?.filename || "",
//     };

//     // Handle fields based on category
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

//     // Save to database
//     const complaint = new Complaint(complaintData);
//     await complaint.save();

//     res.status(200).send("Complaint submitted successfully!");
//   } catch (err) {
//     console.error("Complaint submission error:", err);
//     res.status(500).send("Server error while submitting complaint");
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const Complaint = require("../models/complaint");

// Load environment variables
dotenv.config();

// Multer setup
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

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// POST route to handle complaints
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

    // Email to user
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Complaint Received",
      text: `Hello,\n\nWe have received your complaint under the category: ${category}.\nWe appreciate you reaching out and will get back to you soon.\n\nBest regards,\nComplaint Desk`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Email send error:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res.status(200).send("Complaint submitted successfully!");
  } catch (err) {
    console.error("Complaint submission error:", err);
    res.status(500).send("Server error while submitting complaint");
  }
});

module.exports = router;
