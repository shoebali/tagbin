import React, { useState } from "react";
import { TextField, Button, Container, Typography, Select, MenuItem, FormControl, InputLabel, FormHelperText, Alert } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { addItem } from "../../Utility/Api";
import { endPoints } from "../../Constant/Environment";

const Signup = () => {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState(''); // State for API error message

  const validationSchema = Yup.object({
    fullname: Yup.string()
      .min(2, 'Full Name must be at least 2 characters')
      .required('Full Name is required'),
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    phoneNumber: Yup.string()
      .matches(/^\d{10}$/, 'Phone Number must be exactly 10 digits')
      .required('Phone Number is required'),
    role: Yup.string()
      .oneOf(['Job Seeker', 'Employer'], 'Select a valid user type')
      .required('User type is required'),
  });

  const formik = useFormik({
    initialValues: {
      fullname: '',
      email: '',
      password: '',
      phoneNumber: '',
      role: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const url = `${endPoints.api.UserRegister}`;
        const response = await addItem(url, values);

        if (response.status === 200) {
          setApiError(''); // Clear error if signup is successful
          setTimeout(() => {
            navigate("/login");
          }, 1000);
        } else {
          setApiError(response.error || "An error occurred during signup."); // Improved error handling
        }
      } catch (error) {
        // console.log(error.response.data.error)
        // Handle cases where error may not contain specific details
        setApiError(
          error?.response?.data?.error || 
          "An unexpected error occurred. Please try again."
        );
      }
    },
  });

  return (
    <Container maxWidth="xs">
      <section className="sec-padd">
        <Typography variant="h5" component="h1" align="center">
          Signup
        </Typography>

        {apiError && (
          <Alert severity="error" style={{ marginTop: '16px' }}>
            {apiError}
          </Alert>
        )}

        <form onSubmit={formik.handleSubmit}>
          <TextField
            label="Full Name"
            variant="outlined"
            fullWidth
            margin="normal"
            name="fullname"
            value={formik.values.fullname}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.fullname && Boolean(formik.errors.fullname)}
            helperText={formik.touched.fullname && formik.errors.fullname}
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          <TextField
            label="Phone Number"
            variant="outlined"
            fullWidth
            margin="normal"
            name="phoneNumber"
            value={formik.values.phoneNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
            helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
          />

          {/* User Type Dropdown */}
          <FormControl fullWidth margin="normal" error={formik.touched.role && Boolean(formik.errors.role)}>
            <InputLabel>User Type</InputLabel>
            <Select
              name="role"
              value={formik.values.role}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label="User Type"
            >
              <MenuItem value="Job Seeker">Job Seeker</MenuItem>
              <MenuItem value="Employer">Employer</MenuItem>
            </Select>
            {formik.touched.role && formik.errors.role && (
              <FormHelperText>{formik.errors.role}</FormHelperText>
            )}
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: '16px' }}
          >
            Signup
          </Button>
        </form>
      </section>
    </Container>
  );
};

export default Signup;
