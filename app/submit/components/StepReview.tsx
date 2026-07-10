"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import IconButton from "@mui/material/IconButton";

import {
  GrievanceFormData,
  RELATION_LABELS,
  CATEGORY_LABELS,
  PRIORITY_LABELS,
} from "@/lib/schema";
import { priorityColor } from "@/lib/ui-utils";

interface StepReviewProps {
  data: GrievanceFormData;
  onBack: () => void;
  onEditStep: (step: number) => void;
  onSubmit: () => void;
  submitting: boolean;
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, py: 0.75 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600} sx={{ textAlign: "right" }}>
        {value || "—"}
      </Typography>
    </Box>
  );
}

export default function StepReview({
  data,
  onBack,
  onEditStep,
  onSubmit,
  submitting,
}: StepReviewProps) {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Please check everything below before submitting.
      </Typography>

      <Stack spacing={3}>
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="subtitle2" color="primary">
              Your Details
            </Typography>
            <IconButton size="small" onClick={() => onEditStep(0)} aria-label="Edit your details">
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Box>
          <ReviewRow label="Name" value={data.submitterName} />
          <ReviewRow label="Email" value={data.email} />
          <ReviewRow
            label="Submitting As"
            value={data.relation ? RELATION_LABELS[data.relation] : ""}
          />
          <ReviewRow label="Room / Unit" value={data.roomNumber} />
          <ReviewRow label="Contact Phone" value={data.contactPhone || ""} />
        </Box>

        <Divider />

        <Box>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="subtitle2" color="primary">
              Grievance Details
            </Typography>
            <IconButton size="small" onClick={() => onEditStep(1)} aria-label="Edit grievance details">
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Box>
          <ReviewRow
            label="Category"
            value={data.category ? CATEGORY_LABELS[data.category] : ""}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 0.75 }}>
            <Typography variant="body2" color="text.secondary">
              Priority
            </Typography>
            {data.priority && (
              <Chip
                size="small"
                label={PRIORITY_LABELS[data.priority]}
                color={priorityColor(data.priority)}
              />
            )}
          </Box>
          <Box sx={{ py: 0.75 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Description
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
              {data.description}
            </Typography>
          </Box>
        </Box>
      </Stack>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
        <Button onClick={onBack} size="large" disabled={submitting}>
          Back
        </Button>
        <Button onClick={onSubmit} variant="contained" size="large" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Grievance"}
        </Button>
      </Box>
    </Box>
  );
}
