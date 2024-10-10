import { Box, Typography } from "@mui/material";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

const Jobdetails = () => {
  const params = useParams();
  const [jobDetails, setJobDetails] = useState({});
  const jobData = useCallback(async () => {
    const getToken = JSON.parse(localStorage.getItem("token"));
    const res = await axios.get(
      process.env.REACT_APP_BASE_URL + "/job/" + params?.id,
      {
        headers: {
          Authorization: `Bearer ${getToken}`,
        },
      }
    );
    const resData = await res.data;
    setJobDetails(resData);
  }, [params]);

  useEffect(() => {
    jobData();
  }, [jobData]);
  return (
    <Box
      sx={{
        padding: 2,
        textAlign: "center",
        maxWidth: 600,
        margin: "0 auto",
      }}
    >
      {/* Title */}
      <Typography variant="h4" component="h1" gutterBottom>
        Title:{jobDetails?.title}
      </Typography>

      {/* Description */}
      <Typography variant="body1" color="textSecondary">
        Description:{jobDetails?.description}
      </Typography>
    </Box>
  );
};

export default Jobdetails;
