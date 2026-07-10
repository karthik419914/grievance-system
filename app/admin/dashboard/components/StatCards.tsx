"use client";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { Grievance } from "@/lib/types";

function Stat({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <Grid item xs={6} sm={3}>
      <Paper
        elevation={0}
        sx={{ p: 2.5, borderRadius: 3, border: "1px solid", borderColor: "divider", textAlign: "center" }}
      >
        <Typography variant="h4" fontWeight={700} color={color || "text.primary"}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      </Paper>
    </Grid>
  );
}

export default function StatCards({ grievances }: { grievances: Grievance[] }) {
  const newCount = grievances.filter((g) => g.status === "new").length;
  const inReviewCount = grievances.filter((g) => g.status === "in_review").length;
  const urgentCount = grievances.filter((g) => g.priority === "urgent" && g.status !== "resolved").length;
  const resolvedCount = grievances.filter((g) => g.status === "resolved").length;

  return (
    <Grid container spacing={2}>
      <Stat label="New" value={newCount} />
      <Stat label="In Review" value={inReviewCount} color="info.main" />
      <Stat label="Urgent & Open" value={urgentCount} color="error.main" />
      <Stat label="Resolved" value={resolvedCount} color="success.main" />
    </Grid>
  );
}
