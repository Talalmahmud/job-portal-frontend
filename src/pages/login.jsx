import React, { useState } from "react";
import {
  Container,
  Box,
  Tabs,
  Tab,
  Typography,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TabPanel = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const LoginSignUpTabs = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Login Form
  const LoginForm = () => {
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({
      email: "",
      password: "",
    });

    const handleLoginChange = (e) => {
      const { name, value } = e.target;
      setLoginData({ ...loginData, [name]: value });
    };

    const handleLoginSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/login`,
          loginData
        );
        const resData = response.data;

        localStorage.setItem("token", JSON.stringify(resData?.token));

        navigate("/job");
      } catch (error) {
        console.error(
          "Login failed:",
          error.response?.data?.message || error.message
        );
      }

      // Handle login logic here
    };

    return (
      <Box component="form" onSubmit={handleLoginSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              name="email"
              label="Email Address"
              fullWidth
              variant="outlined"
              value={loginData.email}
              onChange={handleLoginChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="password"
              label="Password"
              type="password"
              fullWidth
              variant="outlined"
              value={loginData.password}
              onChange={handleLoginChange}
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3, mb: 2 }}
        >
          Login
        </Button>
      </Box>
    );
  };

  // Signup Form
  const SignUpForm = () => {
    const [signUpData, setSignUpData] = useState({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    });

    const handleSignUpChange = (e) => {
      const { name, value } = e.target;
      setSignUpData({ ...signUpData, [name]: value });
    };

    const handleSignUpSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BASE_URL}/user`,
          signUpData
        );
        const resData = response.data;

        // Log the response data (typically includes token or user info)
        console.log(resData); // "Login successful"
        localStorage.setItem("token", JSON.stringify(resData?.token));

        // Navigate to the dashboard or home after successful login
        setTabValue(0);
      } catch (error) {
        console.error(
          "Login failed:",
          error.response?.data?.message || error.message
        );
      }
    };

    return (
      <Box component="form" onSubmit={handleSignUpSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              name="firstName"
              label="First Name"
              fullWidth
              variant="outlined"
              value={signUpData.firstName}
              onChange={handleSignUpChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="lastName"
              label="Last Name"
              fullWidth
              variant="outlined"
              value={signUpData.lastName}
              onChange={handleSignUpChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="email"
              label="Email Address"
              fullWidth
              variant="outlined"
              value={signUpData.email}
              onChange={handleSignUpChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="password"
              label="Password"
              type="password"
              fullWidth
              variant="outlined"
              value={signUpData.password}
              onChange={handleSignUpChange}
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign Up
        </Button>
      </Box>
    );
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Welcome
        </Typography>
        <Box sx={{ width: "100%", mt: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label="Login" />
            <Tab label="Sign Up" />
          </Tabs>
          <TabPanel value={tabValue} index={0}>
            <LoginForm />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <SignUpForm />
          </TabPanel>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginSignUpTabs;
