import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import GrievanceForm from "./components/GrievanceForm";

export const metadata = {
  title: "Submit a Grievance | Grievance System",
};

export default function SubmitPage() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: { xs: 4, sm: 8 } }}>
      <Container maxWidth="sm">
        <Box
          component={Link}
          href="/"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            mb: 3,
            color: "text.secondary",
            fontSize: "0.9rem",
          }}
        >
          <ArrowBackIcon fontSize="small" />
          Back to home
        </Box>

        <Typography variant="h4" gutterBottom>
          Submit a Grievance
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Three short steps. Your progress is saved automatically on this device.
        </Typography>

        <GrievanceForm />
      </Container>
    </Box>
  );
}
