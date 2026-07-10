"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

export default function SuccessScreen({ referenceId }: { referenceId: string }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 4, sm: 6 },
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        textAlign: "center",
      }}
    >
      <CheckCircleOutlineIcon color="primary" sx={{ fontSize: 56, mb: 2 }} />
      <Typography variant="h5" gutterBottom>
        Grievance Submitted
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Thank you. Our team has received this and will follow up as needed.
      </Typography>
      <Box
        sx={{
          display: "inline-block",
          bgcolor: "background.default",
          px: 2.5,
          py: 1,
          borderRadius: 2,
          mb: 4,
        }}
      >
        <Typography variant="caption" color="text.secondary" display="block">
          Reference ID
        </Typography>
        <Typography variant="body2" fontWeight={700} sx={{ fontFamily: "monospace" }}>
          {referenceId}
        </Typography>
      </Box>
      <Box>
        <Button component={Link} href="/" variant="contained" size="large">
          Back to Home
        </Button>
      </Box>
    </Paper>
  );
}
