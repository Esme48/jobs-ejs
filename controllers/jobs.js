const Job = require('../models/Job');
//const parseValidationErr = require('./util/parseValidatioinErr');

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId
  const job = await Job.create(req.body)
  res.status(201).json({ job })
}


const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req

  const job = await Job.findByIdAndRemove({
    _id: jobId,
    createdBy: userId,
  })
  if (!job) {
    return res.status(404).json({error: `No job with id ${jobId}`});
  }
  res.status(200).send()
}

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt')
  res.status(200).json({ jobs, count: jobs.length })
}

const updateJob = async (req, res) => {
  const {
    body: { company, position },
    user: { userId },
    params: { id: jobId },
  } = req;

  if (company  === '' || position === '') {
    return res.status(400).json({ error: 'Company or Position Cannot Be Empty'})
  }
  const job = await Job.findByIdAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  )
  if (!job) {
    return res.status(404).json({ error:`No job with id ${jobId}`});
  }
  res.status(200).json({ job })
}


const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req

  const job = await Job.findOne({
    _id: jobId,
    createdBy: userId,
  })
  if (!job) {
    return res.status(404).json({ error: `No job with id ${jobId}`});
  }
  res.status(200).json({ job })
}



module.exports = {
  createJob,
  deleteJob,
  getAllJobs,
  updateJob,
  getJob,
}