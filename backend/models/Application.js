const mongoose = require('mongoose');
 
const ApplicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,  
  },
  seekerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,  
  },
  resume: {
    type: String,
    required: true, 
    validate: {
      validator: function (v) {
        return /\.(pdf|doc|docx)$/.test(v); // Check if the file is a PDF or DOC
      },
      message: (props) => `${props.value} is not a valid resume file! Only PDF or DOC formats are accepted.`,
    },
  },
  coverLetter: {
    type: String,
    required: true
  },
}, {
  timestamps: true, 
});
 
module.exports = mongoose.model('Application', ApplicationSchema);
