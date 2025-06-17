
const createJob = (req, res) =>  {
    res.send("Creating A Job");
};

const editJob = (req, res) => {
    res.send("Editing A Job");
};

const deleteJob = (req, res) => {
    res.send("Deleting Job");
};

const getAllJobs = (req, res) => {
    res.send("Getting All The Jobs");
};

const updateJob = (req, res) => {
    res.send("Updating Job Entry");
};

const getJob = (req, res) => {
    res.send("Getting Single Job Entry");
};



module.exports = {
  createJob,
  editJob,
  deleteJob,
  getAllJobs,
  updateJob,
  getJob,
}