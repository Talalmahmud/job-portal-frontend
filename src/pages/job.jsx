import React, { useEffect, useState } from "react";
import JobAccordion from "../components/Accordion";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { JobCreate } from "../components/JobCreate";
import axios from "axios";

const Job = () => {
  const navigate = useNavigate();
  const [joblist, setJobList] = useState([]);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const getJobList = async () => {
    try {
      const getToken = JSON.parse(localStorage.getItem("token"));
      const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/job`, {
        headers: {
          Authorization: `Bearer ${getToken}`,
        },
      });
      const resData = res.data;
      setJobList(resData?.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getJobList();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",

        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        padding: 4,
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Job Management
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogout}
          sx={{ marginRight: 2 }}
        >
          Logout
        </Button>
        <Button variant="contained" color="secondary" onClick={handleClickOpen}>
          Create Job
        </Button>
      </Box>

      <JobAccordion
        fetchData={getJobList}
        open={open}
        onClose={handleClose}
        handleClickOpen={handleClickOpen}
        jobList={joblist}
      />

      <JobCreate fetchData={getJobList} open={open} onClose={handleClose} />
    </Box>
  );
};

export default Job;
