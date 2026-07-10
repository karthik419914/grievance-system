import { z } from "zod";

/**
 * Step 1 — who is submitting the grievance.
 * Kept intentionally short: residents and family members filling this out
 * in a nursing home setting should not face a long form.
 */
export const stepOneSchema = z.object({
  submitterName: z
    .string()
    .trim()
    .min(2, "Please enter at least 2 characters")
    .max(100, "That name looks too long")
    .regex(/^[\p{L} '-]+$/u, "Please enter a valid name without numbers or symbols"),
  email: z.string().trim().email("Please enter a valid email address"),
  relation: z.enum(["resident", "family_member", "staff", "other"], {
    errorMap: () => ({ message: "Please select who is submitting this" }),
  }),
  roomNumber: z
    .string()
    .trim()
    .min(1, "Room / unit number is required")
    .max(20, "That doesn't look like a valid room number"),
  contactPhone: z
    .string()
    .trim()
    .max(20, "That doesn't look like a valid phone number")
    .optional()
    .or(z.literal("")),
});

/**
 * Step 2 — the actual grievance.
 */
export const stepTwoSchema = z.object({
  category: z.enum(
    [
      "care_quality",
      "food_and_dining",
      "staff_behavior",
      "cleanliness",
      "billing",
      "safety",
      "other",
    ],
    { errorMap: () => ({ message: "Please select a category" }) }
  ),
  priority: z.enum(["low", "medium", "high", "urgent"], {
    errorMap: () => ({ message: "Please select a priority" }),
  }),
  description: z
    .string()
    .trim()
    .min(10, "Please add a few more details (at least 10 characters)")
    .max(1000, "Please keep this under 1000 characters"),
});

export const grievanceSchema = stepOneSchema.merge(stepTwoSchema);

export type StepOneData = z.infer<typeof stepOneSchema>;
export type StepTwoData = z.infer<typeof stepTwoSchema>;
export type GrievanceFormData = z.infer<typeof grievanceSchema>;

export const CATEGORY_LABELS: Record<GrievanceFormData["category"], string> = {
  care_quality: "Quality of Care",
  food_and_dining: "Food & Dining",
  staff_behavior: "Staff Behavior",
  cleanliness: "Cleanliness & Maintenance",
  billing: "Billing & Payments",
  safety: "Safety Concern",
  other: "Other",
};

export const RELATION_LABELS: Record<GrievanceFormData["relation"], string> = {
  resident: "Resident",
  family_member: "Family Member",
  staff: "Staff",
  other: "Other",
};

export const PRIORITY_LABELS: Record<GrievanceFormData["priority"], string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};
