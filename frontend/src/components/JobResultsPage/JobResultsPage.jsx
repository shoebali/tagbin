import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { addItemForm, getAllItemsData } from "../../Utility/Api";
import { endPoints } from "../../Constant/Environment";
import Toaster from "../../components/Toast";
import { ErrorToast, SuccesToast } from "../../components/Toast/message";
import { useSelector } from "react-redux";
import { Link, useParams } from 'react-router-dom';

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  resume: Yup.mixed()
    .required('Resume file is required')
    .test('fileSize', 'File too large', (value) => value && value.size <= 2 * 1024 * 1024), // 2MB limit
  coverLetter: Yup.string().required('Cover letter is required'),
});

const JobResultsPage = () => {
  const { jobTitleSlug } = useParams(); // Get the job title from the URL
  const [relatedJobs, setRelatedJobs] = useState([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null); // To hold the selected job
  const { isAuthenticated, user } = useSelector((state) => state?.auth || {});

  // Function to fetch jobs related to the specific job title
  const fetchRelatedJobs = async (title) => {
    try {
      const url = `${endPoints.api.JobListing}?keyword=${title}`;
      const response = await getAllItemsData(url);
      if (response.status === 200) {
        setRelatedJobs(response.jobs || []);
      } else {
        ErrorToast("Failed to fetch related jobs.");
      }
    } catch (error) {
      console.error('Error fetching related jobs:', error);
      ErrorToast("An error occurred while fetching jobs.");
    }
  };

  useEffect(() => {
    const title = jobTitleSlug.replace(/-/g, ' '); // Convert slug back to title
    fetchRelatedJobs(title);
  }, [jobTitleSlug]);

  const handleClickOpen = (job) => {
    if (user.role === 'Employer') {
      alert("You cannot apply for jobs as an employer. Only job seekers can apply."); // Alert message for employers
    } else {
      setSelectedJob(job); // Set the selected job
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedJob(null); // Clear selected job when modal closes
  };

  const handleSubmitApplication = async (values) => {
    const formData = new FormData();
    formData.append('coverLetter', values.coverLetter);
    formData.append('resume', values.resume);
    formData.append('jobId', selectedJob?._id); // Ensure selectedJob._id is defined

    try {
      setIsLoading(true);
      const url = `${endPoints.api.ApplyJob}${selectedJob?._id}/apply`;
      const response = await addItemForm(url, formData);

      if (response?.status === 'success') {
        SuccesToast("Application submitted successfully");
        handleClose(); // Close modal on success
      } else {
        ErrorToast("Failed to submit application. Please try again.");
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      ErrorToast(error?.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <section className="sec-padd">
        <Typography variant="h4" align="center" sx={{ mb: 3, fontWeight: 'bold' }}>
          Jobs Related to "{jobTitleSlug.replace(/-/g, ' ').toUpperCase()}"
        </Typography>
        <Grid container spacing={2}>
          {relatedJobs.length > 0 ? (
            relatedJobs.map((job) => (
              <Grid item xs={12} sm={6} md={4} key={job?._id}>
                <Card variant="outlined" sx={{ boxShadow: 3, borderRadius: 2, transition: '0.3s' }} className='customJobCard'>
                  <CardContent>
                    <Typography variant="h6" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
                      {job?.title || 'No Title Available'}
                    </Typography>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Company:</Typography>
                      <Typography variant="body1" gutterBottom>{job?.company || 'Not Provided'}</Typography>
                    </Box>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Location:</Typography>
                      <Typography variant="body1" gutterBottom>{job?.location || 'Not Provided'}</Typography>
                    </Box>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Salary:</Typography>
                      <Typography variant="body1" gutterBottom>{job?.salary || 'Not Provided'}</Typography>
                    </Box>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Job Type:</Typography>
                      <Typography variant="body1" gutterBottom>{job?.type || 'Not Provided'}</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">Description:</Typography>
                      <Typography variant="body1" gutterBottom>{job?.description || 'No Description Available'}</Typography>
                    </Box>

                    <div className='text-center'>
                      {isAuthenticated === false ? (
                        <Link to={'/login'} className='customButtonDesign' color="primary" sx={{ mt: 2, width: '200px' }}>
                          Apply
                        </Link>
                      ) : (
                        <Button variant="contained" className='customButton' color="primary" onClick={() => handleClickOpen(job)} sx={{ mt: 2, width: '200px' }}>
                          Apply
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Application Modal */}
                <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                  <DialogTitle>Application Form for {selectedJob?.title || 'This Job'}</DialogTitle>
                  <DialogContent>
                    <Formik
                      initialValues={{
                        resume: null,
                        coverLetter: '',
                      }}
                      validationSchema={validationSchema}
                      onSubmit={handleSubmitApplication}
                    >
                      {({ setFieldValue, errors, touched }) => (
                        <Form>
                          <div>
                            <label htmlFor="resume">Resume</label>
                            <input
                              type="file"
                              id="resume"
                              name="resume"
                              onChange={(event) => {
                                setFieldValue("resume", event.currentTarget.files[0]);
                              }}
                            />
                            {errors.resume && touched.resume && (
                              <div style={{ color: 'red' }}>{errors.resume}</div>
                            )}
                          </div>

                          <div style={{ marginTop: '16px' }}>
                            <label htmlFor="coverLetter">Cover Letter</label>
                            <Field
                              as={TextField}
                              name="coverLetter"
                              margin="dense"
                              type="text"
                              multiline
                              fullWidth
                              rows={4}
                              error={Boolean(errors.coverLetter && touched.coverLetter)}
                              helperText={<ErrorMessage name="coverLetter" />}
                            />
                          </div>

                          <DialogActions>
                            <Button onClick={handleClose} variant="contained" sx={{ backgroundColor: 'red', color: 'white', '&:hover': { backgroundColor: 'darkred' } }}>
                              Cancel
                            </Button>
                            <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
                              {isLoading ? "Submitting..." : "Submit Application"}
                            </Button>
                          </DialogActions>
                        </Form>
                      )}
                    </Formik>
                  </DialogContent>
                </Dialog>
              </Grid>
            ))
          ) : (
            <Typography variant="h6" align="center" sx={{ mt: 3 }}>No related jobs found.</Typography>
          )}
        </Grid>
      </section>
    </>
  );
};

export default JobResultsPage;
