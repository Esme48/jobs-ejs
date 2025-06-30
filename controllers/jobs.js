const Job = require('../models/Job')
const mongoose = require('mongoose');
//const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors');
const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user._id }).sort('createdAt')
  res.render('index', {jobs})
}

const createJob = async (req, res) => {
  req.body.createdBy = req.user._id
  await Job.create(req.body)
  res.redirect('/jobs')
}

const updateJob = async (req, res) => {
  const {
    body: { company, position },
    user: { _id },
    params: { id: jobId },
  } = req

  if (company === '' || position === '') {
    throw new BadRequestError('Company or Position fields cannot be empty')
  }
  const job = await Job.findByIdAndUpdate(
    { _id: jobId, createdBy: _id },
    req.body,
    { new: true, runValidators: true }
  )
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`)
  }
  res.redirect('/jobs')
}

const deleteJob = async (req, res) => {
  const {
    user: { _id },
    params: { id: jobId },
  } = req

  const job = await Job.findOneAndDelete({
    _id: jobId,
    createdBy: _id,
  })
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`)
  }
  res.redirect('/jobs')
}

const createForm = async (req, res) => {
    res.render("job", { job: null })
}

const editForm = async (req, res) => {
  const id = req.params.id
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new NotFoundError(`Invalid job id: ${id}`)
  }

  const job = await Job.findOne({
    _id: req.params.id,
    createdBy: req.user._id,
  })
  if (!job) {
    throw new NotFoundError(`No job with id ${req.params.id}`)
  }
  res.render("job", {job})
}

module.exports = {
  createJob,
  deleteJob,
  getAllJobs,
  updateJob,
  editForm,
  createForm,
}
