"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { stepOneSchema, StepOneData, RELATION_LABELS } from "@/lib/schema";

interface StepOneProps {
  defaultValues: Partial<StepOneData>;
  onNext: (values: StepOneData) => void;
  onSaveDraft: (values: Partial<StepOneData>) => void;
}

const relationOptions = Object.entries(RELATION_LABELS) as [
  StepOneData["relation"],
  string
][];

export default function StepOne({ defaultValues, onNext, onSaveDraft }: StepOneProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<StepOneData>({
    resolver: zodResolver(stepOneSchema),
    defaultValues: {
      submitterName: defaultValues.submitterName ?? "",
      email: defaultValues.email ?? "",
      relation: defaultValues.relation,
      roomNumber: defaultValues.roomNumber ?? "",
      contactPhone: defaultValues.contactPhone ?? "",
    },
  });

  useEffect(() => {
    reset({
      submitterName: defaultValues.submitterName ?? "",
      email: defaultValues.email ?? "",
      relation: defaultValues.relation,
      roomNumber: defaultValues.roomNumber ?? "",
      contactPhone: defaultValues.contactPhone ?? "",
    });
  }, [defaultValues, reset]);

  return (
    <Box component="form" onSubmit={handleSubmit(onNext)} noValidate>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Tell us a little about who is submitting this.
      </Typography>

      <Stack spacing={3}>
        <TextField
          label="Full Name"
          fullWidth
          autoFocus
          {...register("submitterName")}
          error={!!errors.submitterName}
          helperText={errors.submitterName?.message}
        />

        <Controller
          name="relation"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              value={field.value ?? ""}
              select
              label="Submitting As"
              fullWidth
              error={!!errors.relation}
              helperText={errors.relation?.message}
            >
              {relationOptions.map(([value, label]) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        <TextField
          label="Room / Unit Number"
          fullWidth
          {...register("roomNumber")}
          error={!!errors.roomNumber}
          helperText={errors.roomNumber?.message}
        />

        <TextField
          label="Email"
          type="email"
          fullWidth
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <TextField
          label="Contact Phone (optional)"
          fullWidth
          {...register("contactPhone")}
          error={!!errors.contactPhone}
          helperText={errors.contactPhone?.message || "In case staff need to follow up with you"}
        />
      </Stack>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
        <Button variant="outlined" onClick={() => onSaveDraft(getValues())} sx={{ textTransform: "none" }}>
          Save Draft
        </Button>
        <Button type="submit" variant="contained" size="large">
          Next
        </Button>
      </Box>
    </Box>
  );
}
