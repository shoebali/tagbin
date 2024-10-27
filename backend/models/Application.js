const mongoose = require('mongoose');

// Create a schema for the job applications
const ApplicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true, // Ensure jobId is required
  },
  seekerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // Ensure seekerId is required
  },
  resume: {
    type: String,
    required: true, // Ensure resume is required
    validate: {
      validator: function (v) {
        return /\.(pdf|doc|docx)$/.test(v); // Check if the file is a PDF or DOC
      },
      message: (props) => `${props.value} is not a valid resume file! Only PDF or DOC formats are accepted.`,
    },
  },
  coverLetter: {
    type: String,
    required: true, // Ensure coverLetter is required
    // minlength: [3, 'Cover letter must be at least 10 characters long.'], // Minimum length validation
  },
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt fields
});

// Export the Application model
module.exports = mongoose.model('Application', ApplicationSchema);
