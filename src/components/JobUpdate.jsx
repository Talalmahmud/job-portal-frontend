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

export function JobUpdate(props) {
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
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/job/${jobId}`,
          {
            headers: {
              Authorization: `Bearer ${getToken}`,
            },
          }
        );
        const job = res.data;

        // Ensure the job data contains what you're trying to set

        setSelectedCategory(job.category);
        setTitle(job.title);
        setDescription(job.description);
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
    setSelectedCategory("");
    setTitle("");
    setDescription("");
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const getCategoryList = useCallback(async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/category`,
        {
          headers: {
            Authorization: `Bearer ${getToken}`,
          },
        }
      );
      setCategoryList(res.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, [getToken]);

  const handleSubmitJob = async () => {
    const res = await axios.put(
      `${process.env.REACT_APP_BASE_URL}/job/${jobId}`,
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
    const resData = res.data;
    setSnackbarMessage(resData?.message);
    onClose();
    fetchData();
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    getCategoryList();
    if (jobId !== "") {
      jobDetails();
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
      <DialogTitle>Edit Job {typeof jobId}</DialogTitle>

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
