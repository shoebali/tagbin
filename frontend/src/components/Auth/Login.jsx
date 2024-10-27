import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { addItem } from "../../Utility/Api";
import { endPoints } from "../../Constant/Environment";
import { useNavigate } from "react-router-dom";
import { Actions } from "../../redux/Actions/Actions";
import { Link } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");  
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    userType: Yup.string()
      .oneOf(["Job Seeker", "Employer"], "Select a valid user type")
      .required("User type is required"),
  });

  // Set up Formik for form handling and validation
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      userType: "", 
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const url = `${endPoints.api.UserLogin}`;
        setIsLoading(true);
        setApiError(""); // Reset API error message

        const response = await addItem(url, values);
        if (response.status === 200) {
          localStorage.setItem("session", response.token);
          setIsLoading(false);
          dispatch({
            type: Actions.USERLOGIN,
            data: {
              user: response.user,
              token: response.token,
              tokenExpiry: response.expiry,
            },
          });
          if (response.user.role === "Job Seeker") {
            navigate("/");
          } else {
            navigate("/jobs");
          }
        }
      } catch (error) {
        setIsLoading(false);
        // Handle API error
        if (error.response) {
          // Check if error response exists
          setApiError(error?.response?.data?.error || "An error occurred during login."); // Set the error message
        } else {
          setApiError("Network error. Please try again."); // Handle network error
        }
      }
    },
  });

  return (
    <Container maxWidth="xs">
      <section className="sec-padd">
        <Typography variant="h5" component="h1" align="center">
          Login
        </Typography>
        <form onSubmit={formik.handleSubmit}>
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

          {/* User Type Dropdown */}
          <FormControl
            fullWidth
            margin="normal"
            error={formik.touched.userType && Boolean(formik.errors.userType)}
          >
            <InputLabel>User Type</InputLabel>
            <Select
              name="userType"
              value={formik.values.userType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label="User Type"
            >
              <MenuItem value="Job Seeker">Job Seeker</MenuItem>
              <MenuItem value="Employer">Employer</MenuItem>
            </Select>
            {formik.touched.userType && formik.errors.userType && (
              <FormHelperText>{formik.errors.userType}</FormHelperText>
            )}
          </FormControl>

          {apiError && ( // Display API error message if it exists
            <Typography color="error" align="center">
              {apiError}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: "16px" }}
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
        <p className="mt-4 text-center">
          <Link to="/register">Create for new Account</Link> 
        </p>
      </section>
    </Container>
  );
};

export default Login;
