const express = require('express');
const { createJob, getAllJobs, updateJob, deleteJob,getJobDetails,applyJob,getApplicationsForEmployer,getEmployerJobs } = require('../controllers/jobController');
const authMiddleware = require('../middleware/auth');
const accessControl = require('../middleware/accessControl'); 
const router = express.Router();
const upload = require('../middleware/upload');


router.get('/employer_jobs',authMiddleware(['Employer']), getEmployerJobs);
router.get('/',accessControl, getAllJobs);
router.get('/:jobId',accessControl, getJobDetails);
router.post('/', authMiddleware(['Employer']), createJob);
router.put('/:jobId', authMiddleware(['Employer']), updateJob);
router.delete('/:jobId', authMiddleware(['Employer']), deleteJob);
router.post('/:jobId/apply', authMiddleware(['Job Seeker']), upload.single('resume'), applyJob);
router.post('/applications', authMiddleware(['Employer']), getApplicationsForEmployer);

module.exports = router;
