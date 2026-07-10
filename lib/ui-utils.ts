import { GrievanceFormData } from "./schema";
import { GrievanceStatus } from "./types";

type ChipColor = "default" | "success" | "warning" | "error" | "info";

export function priorityColor(priority: GrievanceFormData["priority"]): ChipColor {
  switch (priority) {
    case "urgent":
      return "error";
    case "high":
      return "warning";
    case "medium":
      return "info";
    case "low":
    default:
      return "default";
  }
}

export function statusColor(status: GrievanceStatus): ChipColor {
  switch (status) {
    case "resolved":
      return "success";
    case "in_review":
      return "info";
    case "new":
    default:
      return "default";
  }
}

export function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
