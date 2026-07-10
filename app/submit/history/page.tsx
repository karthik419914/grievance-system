import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import MySubmissions from "../components/MySubmissions";

export const metadata = {
  title: "My Submissions | Grievance System",
};

export default function SubmissionHistoryPage() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: { xs: 4, sm: 8 } }}>
      <Container maxWidth="md">
        <MySubmissions />
      </Container>
    </Box>
  );
}
