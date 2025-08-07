import React from "react";
import {
  Paper,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import ScheduleIcon from "@mui/icons-material/Schedule";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { useNavigate } from "react-router-dom";

const QuickActionsSection = () => {
  const navigate = useNavigate();

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 4,
        // maxWidth: 350,
        backgroundColor: "#f6faff", // light background
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06)",
      }}
    >
      <Typography
        variant="h6"
        fontWeight={700}
        gutterBottom
        sx={{
          color: "#090a29", // Dark text
          fontSize: "1.1rem",
          mb: 2,
        }}
      >
        Quick Actions
      </Typography>

      <Stack spacing={2}>
        <Button
          variant="contained"
          startIcon={<ScheduleIcon />}
          onClick={() => navigate("/main/book-appointment")}
          sx={{
            borderRadius: 3,
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.95rem",
            backgroundColor: "#2e3192", // strong blue
            color: "#fff",
            boxShadow: "0 2px 6px rgba(46, 49, 146, 0.3)",
            "&:hover": {
              backgroundColor: "#1f2378",
            },
          }}
        >
          Schedule a new Appointment
        </Button>

        <Button
          variant="outlined"
          startIcon={<AssessmentIcon />}
          onClick={() => navigate("/main/reports")}
          sx={{
            borderRadius: 3,
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.95rem",
            color: "#2e3192",
            borderColor: "#2e3192",
            backgroundColor: "#fff",
            "&:hover": {
              backgroundColor: "#f0f4ff",
              borderColor: "#2e3192",
            },
          }}
        >
          View Reports
        </Button>

        <Button
          variant="outlined"
          startIcon={<SupportAgentIcon />}
          onClick={() => navigate("/main/help")}
          sx={{
            borderRadius: 3,
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.95rem",
            color: "#2e3192",
            borderColor: "#2e3192",
            backgroundColor: "#fff",
            "&:hover": {
              backgroundColor: "#f0f4ff",
              borderColor: "#74a9f0",
              color: "#74a9f0",
            },
          }}
        >
          Contact Support
        </Button>
      </Stack>
    </Paper>
  );
};

export default QuickActionsSection;

