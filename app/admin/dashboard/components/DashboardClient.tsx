"use client";

import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";

import { Grievance } from "@/lib/types";
import FilterBar, { Filters, SortOrder } from "./FilterBar";
import GrievanceTable from "./GrievanceTable";
import GrievanceDetailDialog from "./GrievanceDetailDialog";
import StatCards from "./StatCards";

const defaultFilters: Filters = {
  priority: "all",
  status: "all",
  category: "all",
  search: "",
};

export default function DashboardClient({
  initialGrievances,
}: {
  initialGrievances: Grievance[];
}) {
  const [grievances, setGrievances] = useState<Grievance[]>(initialGrievances);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [selected, setSelected] = useState<Grievance | null>(null);

  const filtered = useMemo(() => {
    let result = [...grievances];

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
  }, [grievances, filters, sortOrder]);

  const handleStatusUpdated = (id: string, status: Grievance["status"]) => {
    setGrievances((prev) => prev.map((g) => (g.id === id ? { ...g, status } : g)));
    setSelected((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Grievances
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {grievances.length} total submissions
      </Typography>

      <StatCards grievances={grievances} />

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
          <GrievanceTable grievances={filtered} onRowClick={setSelected} />
        </Stack>
      </Paper>

      <GrievanceDetailDialog
        grievance={selected}
        onClose={() => setSelected(null)}
        onStatusUpdated={handleStatusUpdated}
      />
    </Box>
  );
}
