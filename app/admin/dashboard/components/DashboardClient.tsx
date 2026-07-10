"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";

import { Grievance } from "@/lib/types";
import FilterBar, { Filters, SortOrder } from "./FilterBar";
import GrievanceTable from "./GrievanceTable";
import StatCards from "./StatCards";
import Alert from "@mui/material/Alert";

const defaultFilters: Filters = {
  priority: "all",
  status: "all",
  category: "all",
  search: "",
};

export default function DashboardClient({
  initialGrievances,
  usingFirestore,
  firestoreConfigured,
  firestoreMissing,
}: {
  initialGrievances: Grievance[];
  usingFirestore?: boolean;
  firestoreConfigured?: boolean;
  firestoreMissing?: string[];
}) {
  const router = useRouter();
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  const filtered = useMemo(() => {
    let result = [...initialGrievances];

    if (filters.priority !== "all") {
      result = result.filter((g) => g.priority === filters.priority);
    }
    if (filters.status !== "all") {
      result = result.filter((g) => g.status === filters.status);
    }
    if (filters.category !== "all") {
      result = result.filter((g) => g.category === filters.category);
    }
    if (filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      result = result.filter(
        (g) =>
          g.submitterName.toLowerCase().includes(q) ||
          g.email.toLowerCase().includes(q) ||
          g.roomNumber.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [initialGrievances, filters, sortOrder]);

  // Status updates handled on details page

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Grievances
      </Typography>
      {usingFirestore !== undefined && (
        <Alert severity={usingFirestore ? "success" : "info"} sx={{ mb: 3 }}>
          {usingFirestore
            ? "Grievances are available."
            : "Using local JSON fallback storage because Firebase is not configured."}
        </Alert>
      )}
      {usingFirestore === false && firestoreConfigured === false && firestoreMissing && firestoreMissing.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Firestore is disabled because the following server env vars are missing: {firestoreMissing.join(", ")}.
          Add them to .env.local and restart the app.
        </Alert>
      )}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {initialGrievances.length} total submissions
      </Typography>

      <StatCards grievances={initialGrievances} />

      <Paper
        elevation={0}
        sx={{ p: { xs: 2, sm: 3 }, mt: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}
      >
        <FilterBar
          filters={filters}
          onFiltersChange={setFilters}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
        />
 
        <Stack sx={{ mt: 2 }}>
          <GrievanceTable grievances={filtered} onRowClick={(g) => router.push(`/admin/dashboard/${g.id}`)} />
        </Stack>
      </Paper>
    </Box>
  );
}
