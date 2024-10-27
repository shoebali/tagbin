const Job = require('../models/Job');
const Application = require('../models/Application');

exports.createJob = async (req, res) => {
  // Check if the user is an employer
  if (req.user.role !== 'Employer') {
    return res.status(403).json({ message: 'Access denied. Only employers can create jobs.' });
  }

  try {
    const job = new Job({ ...req.body, employerId: req.user.userId });
    await job.save();
    return res.status(200).json({ status: 'success', message: 'Job Created Successfull' });
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    // Handle other errors
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all job listings (accessible to all users)
exports.getAllJobs = async (req, res) => {
  try {
    const { keyword, location, type, minSalary, maxSalary } = req.query;

    const filter = {};

    // Keyword search
    if (keyword) {
      filter.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { company: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }

    // Location filter
    if (location) {
      filter.location = { $regex: location, $options: 'i' }; // Case-insensitive search
    }

    // Job type filter
    if (type) {
      filter.type = type; // Direct match
    }

    // Salary range filter
    if (minSalary || maxSalary) {
      filter.salary = {};
      if (minSalary) {
        filter.salary.$gte = minSalary; // Minimum salary
      }
      if (maxSalary) {
        filter.salary.$lte = maxSalary; // Maximum salary
      }
    }

    const jobs = await Job.find(filter);
    // res.json(jobs);
    res.status(200).json({
      status: 200,
      jobs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getEmployerJobs = async (req, res) => {
  try {
    const employerId = req.user.userId; // Authenticated employer's ID

    // Retrieve jobs by employerId in descending order based on createdAt
    const jobs = await Job.find({ employerId }).sort({ createdAt: -1 });

    // Send the response with the jobs list
    res.status(200).json({
      status: 200,
      jobs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Update a job listing (only for employers)
exports.updateJob = async (req, res) => {
  // Check if the user is an employer
  if (req.user.role !== 'Employer') {
    return res.status(403).json({ message: 'Access denied. Only employers can update jobs.' });
  }

  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.jobId, employerId: req.user.userId },
      req.body,
      { new: true, runValidators: true } // runValidators will enforce schema validations on updates
    );

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    return res.status(200).json({ status: 'success', message: 'Job Updated Successfull' });
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    // Handle other errors
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a job listing (only for employers)
exports.deleteJob = async (req, res) => {
  // Check if the user is an employer
  if (req.user.role !== 'Employer') {
    return res.status(403).json({ message: 'Access denied. Only employers can delete jobs.' });
  }

  try {
    const result = await Job.deleteOne({ _id: req.params.jobId, employerId: req.user.userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Job not found' });
    }

    return res.status(200).json({ status: 'success', message: 'Job deleted Successfull' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


// Fetch job details by ID
exports.getJobDetails = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    // Find the job by its ID
    const job = await Job.findById(jobId).populate('employerId', 'fullname email');

    // Check if the job exists
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.applyJob = async (req, res) => {
  const { jobId } = req.params;
  const { coverLetter } = req.body;

  // Check if a file was uploaded
  if (!req.file) {
    return res.status(400).json({ message: 'Resume file is required' });
  }

  const { filename: resume } = req.file; // Get the filename of the uploaded file

  // Check if the job exists
  const job = await Job.findById(jobId);
  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }

  // Create a new application
  const application = new Application({
    jobId,
    seekerId: req.user.userId,
    resume: `/uploads/${resume}`, // Store the path to the uploaded file
    coverLetter
  });

  try {
    await application.save();
    res.status(200).json({ status: 'success',message: 'Application submitted successfully', application });
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    res.status(500).json({ message: 'Error submitting application', error });
  }
};


exports.getApplicationsForEmployer = async (req, res) => {
  try {
    // Fetch jobs posted by the employer
    const jobs = await Job.find({ employerId: req.user.userId });
    // Get the job IDs from the jobs
    const jobIds = jobs.map(job => job._id);

    // Fetch applications related to the employer's jobs, sorted by date descending
    const applications = await Application.find({ jobId: { $in: jobIds } })
      .populate('jobId', 'title company location description salary type')  
      .populate('seekerId', 'fullname email phoneNumber resume coverLetter')  
      .sort({ createdAt: -1 }); // Sort by date in descending order

    res.status(200).json({ status: 'success', applications });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
