const express = require("express");
const router = express.Router();

const {
  createJob,
  deleteJob,
  getAllJobs,
  updateJob,
  createForm,
  editForm,
} = require('../controllers/jobs');

router.get("/", getAllJobs);
router.get("/new", createForm);
router.post("/create", createJob);
router.get("/edit/:id", editForm);
router.post("/delete/:id", deleteJob);
router.post("/update/:id", updateJob);

module.exports = router;