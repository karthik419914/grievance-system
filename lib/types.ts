import { GrievanceFormData } from "./schema";

export type GrievanceStatus = "new" | "in_review" | "resolved";

export interface Grievance extends GrievanceFormData {
  id: string;
  status: GrievanceStatus;
  createdAt: string; // ISO timestamp
}

export const STATUS_LABELS: Record<GrievanceStatus, string> = {
  new: "New",
  in_review: "In Review",
  resolved: "Resolved",
};
