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

import {
  stepTwoSchema,
  StepTwoData,
  CATEGORY_LABELS,
  PRIORITY_LABELS,
} from "@/lib/schema";

interface StepTwoProps {
  defaultValues: Partial<StepTwoData>;
  onNext: (values: StepTwoData) => void;
  onBack: (values: StepTwoData) => void;
  onSaveDraft: (values: Partial<StepTwoData>) => void;
}

const categoryOptions = Object.entries(CATEGORY_LABELS) as [
  StepTwoData["category"],
  string
][];

const priorityOptions = Object.entries(PRIORITY_LABELS) as [
  StepTwoData["priority"],
  string
][];

export default function StepTwo({ defaultValues, onNext, onBack, onSaveDraft }: StepTwoProps) {
  const {
    register,
    control,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm<StepTwoData>({
    resolver: zodResolver(stepTwoSchema),
    defaultValues: {
      category: defaultValues.category,
      priority: defaultValues.priority,
      description: defaultValues.description ?? "",
    },
  });

  useEffect(() => {
    reset({
      category: defaultValues.category,
      priority: defaultValues.priority,
      description: defaultValues.description ?? "",
    });
  }, [defaultValues, reset]);

  return (
    <Box component="form" onSubmit={handleSubmit(onNext)} noValidate>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        What happened, and how urgent is it?
      </Typography>

      <Stack spacing={3}>
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              value={field.value ?? ""}
              select
              label="Category"
              fullWidth
              error={!!errors.category}
              helperText={errors.category?.message}
            >
              {categoryOptions.map(([value, label]) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        <Controller
          name="priority"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              value={field.value ?? ""}
              select
              label="Priority"
              fullWidth
              error={!!errors.priority}
              helperText={errors.priority?.message}
            >
              {priorityOptions.map(([value, label]) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        <TextField
          label="Describe the issue"
          fullWidth
          multiline
          minRows={4}
          {...register("description")}
          error={!!errors.description}
          helperText={errors.description?.message || "A few sentences is enough"}
        />
      </Stack>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
        <Button onClick={() => onBack(getValues() as StepTwoData)} size="large">
          Back
        </Button>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" onClick={() => onSaveDraft(getValues() as Partial<StepTwoData>)} sx={{ textTransform: "none" }}>
            Save Draft
          </Button>
          <Button type="submit" variant="contained" size="large">
            Next
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
