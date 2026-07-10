import { getAllGrievances } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import { CATEGORY_LABELS, PRIORITY_LABELS, RELATION_LABELS } from "@/lib/schema";
import { priorityColor, formatDate } from "@/lib/ui-utils";
import ReportStatusSelector from "./components/ReportStatusSelector";

export const metadata = {
  title: "Grievance Report | Admin Dashboard",
};

interface PageProps {
  params: {
    id: string;
  };
}

export default async function GrievanceReportPage({ params }: PageProps) {
  // Check authentication
  const authed = await isAuthenticated();
  if (!authed) {
    redirect("/admin/login");
  }

  const all = await getAllGrievances();
  const grievance = all.find((g) => g.id === params.id);

  if (!grievance) {
    notFound();
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto" }}>
      <Button
        component={Link}
        href="/admin/dashboard"
        variant="outlined"
        color="primary"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 4, textTransform: "none", borderRadius: 2, fontWeight: 600 }}
      >
        Back to Dashboard
      </Button>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 5 },
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 2, mb: 3 }}>
          <Box>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Grievance Details
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              Reference: {grievance.referenceCode}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Chip label={PRIORITY_LABELS[grievance.priority]} color={priorityColor(grievance.priority)} size="small" />
            <Chip label={CATEGORY_LABELS[grievance.category]} variant="outlined" size="small" />
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Stack spacing={3}>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
              Submitted By
            </Typography>
            <Typography variant="body1">
              {grievance.submitterName} ({RELATION_LABELS[grievance.relation]}) — Room {grievance.roomNumber}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
              Email
            </Typography>
            <Typography variant="body1">
              <a href={`mailto:${grievance.email}`} style={{ color: "inherit", textDecoration: "underline" }}>
                {grievance.email}
              </a>
            </Typography>
          </Box>

          {grievance.contactPhone && (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
                Contact Phone
              </Typography>
              <Typography variant="body1">
                {grievance.contactPhone}
              </Typography>
            </Box>
          )}

          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
              Submitted On
            </Typography>
            <Typography variant="body1">
              {formatDate(grievance.createdAt)}
            </Typography>
          </Box>

          <Divider sx={{ my: 1 }} />

          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
              Description
            </Typography>
            <Paper variant="outlined" sx={{ p: 3, bgcolor: "background.default", borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
              <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                {grievance.description}
              </Typography>
            </Paper>
          </Box>

          <Divider sx={{ my: 1 }} />

          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 1.5 }}>
              Grievance Status
            </Typography>
            <ReportStatusSelector grievanceId={grievance.id} initialStatus={grievance.status} />
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
