"use client";

import { useState, useTransition } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import { STATUS_LABELS, GrievanceStatus } from "@/lib/types";
import { updateStatusAction } from "../../actions";

interface ReportStatusSelectorProps {
  grievanceId: string;
  initialStatus: GrievanceStatus;
}

export default function ReportStatusSelector({
  grievanceId,
  initialStatus,
}: ReportStatusSelectorProps) {
  const [status, setStatus] = useState<GrievanceStatus>(initialStatus);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleStatusChange = (newStatus: GrievanceStatus) => {
    setError(null);
    startTransition(async () => {
      const result = await updateStatusAction(grievanceId, newStatus);
      if (result.success) {
        setStatus(newStatus);
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <Box sx={{ maxWidth: 400 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        select
        label="Update Status"
        fullWidth
        value={status}
        disabled={isPending}
        onChange={(e) => handleStatusChange(e.target.value as GrievanceStatus)}
      >
        {Object.entries(STATUS_LABELS).map(([value, label]) => (
          <MenuItem key={value} value={value}>
            {label}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
}
