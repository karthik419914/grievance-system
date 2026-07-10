import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
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
        <Button
          component={Link}
          href="/"
          variant="outlined"
          color="primary"
          startIcon={<ArrowBackIcon />}
          sx={{
            mb: 3,
            textTransform: "none",
            borderRadius: 2,
            fontWeight: 600,
          }}
        >
          Back to home
        </Button>

        <Typography variant="h4" gutterBottom>
          Submit a Grievance
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Three short steps. Your progress is saved automatically on this device.
        </Typography>

        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, mb: 4 }}>
          <Typography variant="body2" color="text.secondary" sx={{ flex: 1, alignSelf: "center" }}>
            Use this page to submit a new grievance. Your draft is saved automatically while you complete the form.
          </Typography>
        </Box>

        <GrievanceForm />
      </Container>
    </Box>
  );
}
