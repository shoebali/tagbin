import React, { useState, useEffect } from "react";
import JobListing from '../components/JobListing';
import { endPoints } from "../Constant/Environment";
import { getAllItemsData } from "../Utility/Api";
import { Grid, Typography, Slider } from '@mui/material';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const valuetext = (value) => {
  return `${value}`; // Adding Euro symbol for clarity
};

const JobListPage = () => {
  const [showJobs, setJobs] = useState([]);
  const [value, setValue] = useState([0, 200000]); // Initial salary range
  const [location, setLocation] = useState(''); // State for location
  const [jobType, setJobType] = useState(''); // State for job type

  const handleChange = (event, newValue) => {
    setValue(newValue); // Update salary range
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value); // Update location state
  };

  const handleJobTypeChange = (event) => {
    setJobType(event.target.value); // Update job type state
  };

  const getJobListingData = () => {
    let url = `${endPoints.api.JobListing}?minSalary=${value[0]}&maxSalary=${value[1]}&location=${location}&type=${jobType}`;
    getAllItemsData(url)
      .then((response) => {
        const { status, jobs } = response;
        if (status === 200) {
          setJobs(jobs);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getJobListingData();
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [value, location, jobType]); // Dependency array to refetch jobs when filters change

  const handleFilterSubmit = (event) => {
    event.preventDefault(); // Prevent page reload
    getJobListingData(); // Fetch filtered jobs
  };

  const handleClearFilters = () => {
    setValue([0, 200000]); // Reset salary range
    setLocation(''); // Reset location
    setJobType(''); // Reset job type
  };

  return (
    <section className="sec-padd">
      <Container className="mb-3">
        <Typography variant="h5" component="h1" align="center">
          Filter Jobs
        </Typography>
        <Form className="mb-5" onSubmit={handleFilterSubmit}>
          <Row className="mt-3">
            <Col md={4} className="pe-2">
              <Form.Control
                type="search"
                placeholder="Location"
                aria-label="Location"
                name="location"
                value={location} // Set value from state
                onChange={handleLocationChange} // Update location on change
              />
            </Col>

            <Col md={4} className="pe-2">
              <Form.Select aria-label="Job Type" name="jobType" value={jobType} onChange={handleJobTypeChange}>
                <option value="">Select Job Type</option>
                <option value="Full-Time">Full-time</option>
                <option value="Part-Time">Part-time</option>
                <option value="Remote">Remote</option>
              </Form.Select>
            </Col>

            <Col md={4} className="pe-2">
              <Slider
                value={value}
                onChange={handleChange}
                valueLabelDisplay="auto"
                getAriaValueText={valuetext}
                min={0}
                max={200000}
                valueLabelFormat={valuetext}
                aria-labelledby="range-slider"
              />
              <Form.Text muted>
                Salary Range: {valuetext(value[0])} - {valuetext(value[1])}
              </Form.Text>
            </Col>
            {(location || jobType || value[0] !== 0 || value[1] !== 200000) && (
              <Col md={12} className="text-center">
                <Button   onClick={handleClearFilters}>
                  Clear Filters
                </Button>
              </Col>
            )}
          </Row>
          
        </Form>
      </Container>

      <Typography variant="h5" component="h1" align="center">
        Jobs List
      </Typography>

      {showJobs.length > 0 ? (
        <Grid container spacing={2} sx={{ padding: 2 }}>
          {showJobs.map(job => (
            <JobListing key={job._id} job={job} />
          ))}
        </Grid>
      ) : (
        <Typography variant="h6" align="center" color="textSecondary" sx={{ marginTop: 4 }}>
          No jobs found. Try adjusting your filters.
        </Typography>
      )}
    </section>
  );
};

export default JobListPage;
