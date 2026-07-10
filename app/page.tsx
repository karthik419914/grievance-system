import Link from "next/link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import HealthAndSafetyOutlinedIcon from "@mui/icons-material/HealthAndSafetyOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";

export default function HomePage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box component="header" sx={{ py: 3, borderBottom: "1px solid", borderColor: "divider" }}>
        <Container maxWidth="md" sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <HealthAndSafetyOutlinedIcon color="primary" fontSize="large" />
          <Typography variant="h6" fontWeight={700}>
            Grievance System
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", py: 8 }}>
        <Typography variant="h3" gutterBottom sx={{ maxWidth: 560 }}>
          We&apos;re here to listen.
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 520, mb: 5 }}>
          Use this portal to share a concern about care, staff, food, or safety.
          It takes about two minutes, and our team reviews every submission.
        </Typography>

       <Box sx={{ mt: 4, display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
         <Button component={Link} href="/submit/report" variant="outlined" size="large" fullWidth>
           Search report
         </Button>
       </Box>

       <Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ mt: 4 }}>
         <Paper
           elevation={0}
           sx={{
             p: 4,
             flex: 1,
             borderRadius: 3,
             border: "1px solid",
             borderColor: "divider",
           }}
         >
           <EditNoteOutlinedIcon color="primary" sx={{ fontSize: 34, mb: 1.5 }} />
           <Typography variant="h6" gutterBottom>
             Submit a Grievance
           </Typography>
           <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
             For residents, family members, or staff. No account needed — your
             draft is saved automatically if you need to step away.
           </Typography>
           <Button
             component={Link}
             href="/submit"
             variant="contained"
             size="large"
             fullWidth
           >
             Start Now
           </Button>
         </Paper>

         <Paper
           elevation={0}
           sx={{
             p: 4,
             flex: 1,
             borderRadius: 3,
             border: "1px solid",
             borderColor: "divider",
           }}
         >
           <AdminPanelSettingsOutlinedIcon color="primary" sx={{ fontSize: 34, mb: 1.5 }} />
           <Typography variant="h6" gutterBottom>
             Admin Dashboard
           </Typography>
           <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
             For care home staff. Review, filter, and update the status of
             submitted grievances.
           </Typography>
           <Button
             component={Link}
             href="/admin/login"
             variant="outlined"
             size="large"
             fullWidth
           >
             Admin Sign In
           </Button>
         </Paper>
       </Stack>

       <Box sx={{ mt: 5, p: 4, borderRadius: 3, border: "1px solid", borderColor: "divider", bgcolor: "background.paper" }}>
         <Typography variant="h6" gutterBottom>
           What this grievance system does
         </Typography>
         <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
           Submit concerns quickly with clear categories, contact details, and a short review process.
         </Typography>
         <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
           Administrators can filter, search, and prioritize submissions so every issue gets reviewed promptly.
         </Typography>
         <Typography variant="body2" color="text.secondary">
           The portal works for residents, family members, and staff, and keeps progress saved so users can pause and return without losing their draft.
         </Typography>
       </Box>
      </Container>

      <Box component="footer" sx={{ py: 3, textAlign: "center" }}>
        <Typography variant="caption" color="text.secondary">
          If this is a medical emergency, please contact staff directly instead of using this form.
        </Typography>
      </Box>
    </Box>
  );
}
