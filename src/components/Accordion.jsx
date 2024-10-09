import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit"; // Import Edit Icon
import DeleteIcon from "@mui/icons-material/Delete"; // Import Delete Icon
import { JobCreate } from "./JobCreate"; // Assuming SimpleDialog is exported from JobCreate
import axios from "axios"; // Assuming axios is used for API calls
import { JobUpdate } from "./JobUpdate";

const JobAccordion = ({
  jobList,
  fetchData,
  open,
  onClose,
  handleClickOpen,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [jobId, setJobId] = useState(""); // State to hold the job ID
  const [deleteJobId, setDeleteJobId] = useState(""); // State to hold the job ID for deletion
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // State to control delete confirmation dialog
  const [editOpen, setEditOpen] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const updateItem = (jItem) => {
    setJobId(jItem?._id); // Set job ID to the selected job's ID
    setEditOpen(true); // Open the dialog
  };

  const handleDelete = (jItem) => {
    setDeleteJobId(jItem?._id); // Set the job ID to delete
    setOpenDeleteDialog(true); // Open the delete confirmation dialog
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8001/api/v1/job/${deleteJobId}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      });
      fetchData(); // Fetch the updated data after deletion
      setOpenDeleteDialog(false); // Close the confirmation dialog
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false); // Close delete confirmation dialog without deleting
  };

  return (
    <Box sx={{ width: "375px" }}>
      {jobList?.map((item, index) => (
        <Accordion
          key={index}
          expanded={expanded === index}
          onChange={handleChange(index)}
          sx={{
            marginTop: "8px",
            marginBottom: "8px",
            backgroundColor: "#d7d7d9",
          }}
        >
          <AccordionSummary
            expandIcon={<AddIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            sx={{}}
          >
            <Typography>{item?.title}</Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              display: "flex",
              flexDirection: "column",
              borderRight: "0px",
              borderLeft: "0px",
              borderBottom: "0px",
              borderTop: "1px",
              borderStyle: "solid",
              borderColor: "green",
            }}
          >
            {item?.jobs?.map((jItem, jIndex) => (
              <Box
                key={jIndex}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  padding: "4px",
                  // Optional: to separate job items
                }}
              >
                <Link to={"/"} style={{ flexGrow: 1 }}>
                  {jIndex + 1}.{jItem?.title}
                </Link>
                <Box>
                  <IconButton onClick={() => updateItem(jItem)}>
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(jItem)}>
                    <DeleteIcon color="secondary" />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
      {/* Ensure onClose is passed correctly to close the dialog */}
      <JobUpdate
        open={editOpen}
        onClose={() => setEditOpen(false)}
        jobId={jobId}
        fetchData={fetchData}
      />
      <JobCreate open={open} onClose={onClose} jobId={jobId} />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this job?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default JobAccordion;
