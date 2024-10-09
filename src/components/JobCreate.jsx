import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";

export function SimpleDialog(props) {
  const { onClose, open, fetchData, jobId } = props;

  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const getToken = JSON.parse(localStorage.getItem("token"));

  const jobDetails = useCallback(async () => {
    if (jobId !== "") {
      console.log(jobId); // Ensure jobId is being logged
      try {
        const res = await axios.get(
          `http://localhost:8001/api/v1/job/${jobId}`,
          {
            headers: {
              Authorization: `Bearer ${getToken}`,
            },
          }
        );
        const job = res.data;
        console.log("Fetched Job Details:", job); // Debugging log to check response structure

        // Ensure the job data contains what you're trying to set
        if (job && job.category && job.title && job.description) {
          setSelectedCategory(job.category);
          setTitle(job.title);
          setDescription(job.description);
        } else {
          console.error("Missing fields in job data:", job);
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    }
  }, [jobId, getToken]);

  const handleClose = () => {
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setSelectedCategory(""); // Reset to empty or default if needed
    setTitle("");
    setDescription("");
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const getCategoryList = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:8001/api/v1/category", {
        headers: {
          Authorization: `Bearer ${getToken}`,
        },
      });
      setCategoryList(res.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, [getToken]);

  const handleSubmitJob = async () => {
    if (!selectedCategory || !title || !description) {
      setSnackbarMessage("Please fill all fields.");
      setOpenSnackbar(true);
      return;
    }

    try {
      let res;
      if (jobId) {
        // Update existing job
        res = await axios.put(
          `http://localhost:8001/api/v1/job/${jobId}`,
          {
            category: selectedCategory,
            title: title,
            description: description,
          },
          {
            headers: {
              Authorization: `Bearer ${getToken}`,
            },
          }
        );
        setSnackbarMessage("Job updated successfully!");
      } else {
        // Add new job
        res = await axios.post(
          "http://localhost:8001/api/v1/job",
          {
            category: selectedCategory,
            title: title,
            description: description,
          },
          {
            headers: {
              Authorization: `Bearer ${getToken}`,
            },
          }
        );
        setSnackbarMessage("Job added successfully!");
      }

      setOpenSnackbar(true);
      fetchData();
      handleClose();
    } catch (error) {
      console.error("Error saving job:", error);
      setSnackbarMessage(
        jobId ? "Failed to update job." : "Failed to add job."
      );
      setOpenSnackbar(true);
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    getCategoryList(); // Fetch categories once
    if (jobId) {
      jobDetails(); // Fetch job details if jobId exists
    }
  }, [getCategoryList, jobId, jobDetails]);

  return (
    <Dialog
      sx={{
        "& .MuiDialog-paper": {
          padding: "16px",
          width: "475px",
          maxWidth: "none",
        },
        mx: "auto",
      }}
      onClose={handleClose}
      open={open}
    >
      <DialogTitle>
        {jobId ? "Edit Job" : "Add Job"} {typeof jobId}
      </DialogTitle>

      <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
        <InputLabel id="category-select-label">Category</InputLabel>
        <Select
          labelId="category-select-label"
          value={selectedCategory}
          onChange={handleCategoryChange}
          label="Category"
        >
          {categoryList.map((item) => (
            <MenuItem key={item._id} value={item._id}>
              {item.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        name="title"
        label="Title"
        fullWidth
        variant="outlined"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        name="description"
        label="Description"
        fullWidth
        variant="outlined"
        multiline
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button variant="contained" color="primary" onClick={handleSubmitJob}>
        {jobId ? "Update" : "Add"}
      </Button>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="info"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}
