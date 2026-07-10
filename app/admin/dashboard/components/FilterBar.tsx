"use client";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

import { GrievanceFormData, CATEGORY_LABELS, PRIORITY_LABELS } from "@/lib/schema";
import { GrievanceStatus, STATUS_LABELS } from "@/lib/types";

export type SortOrder = "newest" | "oldest";

export interface Filters {
  priority: GrievanceFormData["priority"] | "all";
  status: GrievanceStatus | "all";
  category: GrievanceFormData["category"] | "all";
  search: string;
}

interface FilterBarProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  sortOrder: SortOrder;
  onSortOrderChange: (order: SortOrder) => void;
}

export default function FilterBar({
  filters,
  onFiltersChange,
  sortOrder,
  onSortOrderChange,
}: FilterBarProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "flex-start",
      }}
    >
      <TextField
        placeholder="Search name, room, or description"
        size="small"
        value={filters.search}
        onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
        sx={{ minWidth: 260, flex: 1 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        select
        size="small"
        label="Priority"
        value={filters.priority}
        onChange={(e) => onFiltersChange({ ...filters, priority: e.target.value as Filters["priority"] })}
        sx={{ minWidth: 150 }}
      >
        <MenuItem value="all">All Priorities</MenuItem>
        {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
          <MenuItem key={value} value={value}>
            {label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        size="small"
        label="Status"
        value={filters.status}
        onChange={(e) => onFiltersChange({ ...filters, status: e.target.value as Filters["status"] })}
        sx={{ minWidth: 150 }}
      >
        <MenuItem value="all">All Statuses</MenuItem>
        {Object.entries(STATUS_LABELS).map(([value, label]) => (
          <MenuItem key={value} value={value}>
            {label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        size="small"
        label="Category"
        value={filters.category}
        onChange={(e) => onFiltersChange({ ...filters, category: e.target.value as Filters["category"] })}
        sx={{ minWidth: 180 }}
      >
        <MenuItem value="all">All Categories</MenuItem>
        {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
          <MenuItem key={value} value={value}>
            {label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        size="small"
        label="Sort by Date"
        value={sortOrder}
        onChange={(e) => onSortOrderChange(e.target.value as SortOrder)}
        sx={{ minWidth: 160 }}
      >
        <MenuItem value="newest">Newest First</MenuItem>
        <MenuItem value="oldest">Oldest First</MenuItem>
      </TextField>
    </Box>
  );
}
