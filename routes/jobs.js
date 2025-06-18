const express = require("express");
const router = express.Router();

const {
  createJob,
  deleteJob,
  getAllJobs,
  updateJob,
  getJob,
  createForm,
} = require('../controllers/jobs');

router.get("/create", createForm);
router.post("/create", createJob);
router.post("/delete/:id", deleteJob);
router.get("/", getAllJobs);
router.post("/update/:id", updateJob);
router.get("/:id", getJob);

module.exports = router;