"use client";

import { useState, useTransition } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";

import { Grievance, GrievanceStatus, STATUS_LABELS } from "@/lib/types";
import { CATEGORY_LABELS, PRIORITY_LABELS, RELATION_LABELS } from "@/lib/schema";
import { priorityColor, formatDate } from "@/lib/ui-utils";
import { updateStatusAction } from "../actions";

interface GrievanceDetailDialogProps {
  grievance: Grievance | null;
  onClose: () => void;
  onStatusUpdated: (id: string, status: GrievanceStatus) => void;
}

export default function GrievanceDetailDialog({
  grievance,
  onClose,
  onStatusUpdated,
}: GrievanceDetailDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (!grievance) return null;

  const handleStatusChange = (status: GrievanceStatus) => {
    setError(null);
    startTransition(async () => {
      const result = await updateStatusAction(grievance.id, status);
      if (result.success) {
        onStatusUpdated(grievance.id, status);
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <Dialog open={!!grievance} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Grievance Details
        <Typography variant="caption" color="text.secondary" display="block">
          Reference: {grievance.referenceCode}
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <Chip label={PRIORITY_LABELS[grievance.priority]} color={priorityColor(grievance.priority)} size="small" />
          <Chip label={CATEGORY_LABELS[grievance.category]} variant="outlined" size="small" />
        </Box>

        <Typography variant="body2" color="text.secondary">
          Submitted By
        </Typography>
        <Typography variant="body1" gutterBottom>
          {grievance.submitterName} ({RELATION_LABELS[grievance.relation]}) — Room {grievance.roomNumber}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Email
        </Typography>
        <Typography variant="body1" gutterBottom>
          {grievance.email}
        </Typography>

        {grievance.contactPhone && (
          <>
            <Typography variant="body2" color="text.secondary">
              Contact Phone
            </Typography>
            <Typography variant="body1" gutterBottom>
              {grievance.contactPhone}
            </Typography>
          </>
        )}

        <Typography variant="body2" color="text.secondary">
          Submitted On
        </Typography>
        <Typography variant="body1" gutterBottom>
          {formatDate(grievance.createdAt)}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="body2" color="text.secondary" gutterBottom>
          Description
        </Typography>
        <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", mb: 3 }}>
          {grievance.description}
        </Typography>

        <TextField
          select
          label="Status"
          fullWidth
          value={grievance.status}
          disabled={isPending}
          onChange={(e) => handleStatusChange(e.target.value as GrievanceStatus)}
        >
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
