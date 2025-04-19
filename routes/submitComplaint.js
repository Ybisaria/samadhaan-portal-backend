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
