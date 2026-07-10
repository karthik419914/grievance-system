"use client";

import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { Grievance, STATUS_LABELS } from "@/lib/types";
import { CATEGORY_LABELS, PRIORITY_LABELS } from "@/lib/schema";
import { priorityColor, statusColor, formatDate } from "@/lib/ui-utils";

interface GrievanceTableProps {
  grievances: Grievance[];
  onRowClick: (grievance: Grievance) => void;
}

export default function GrievanceTable({ grievances, onRowClick }: GrievanceTableProps) {
  if (grievances.length === 0) {
    return (
      <Box sx={{ py: 6, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          No grievances match the current filters.
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Submitted By</TableCell>
            <TableCell>Room</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Date Submitted</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {grievances.map((g) => (
            <TableRow
              key={g.id}
              hover
              onClick={() => onRowClick(g)}
              sx={{ cursor: "pointer" }}
            >
              <TableCell>{g.submitterName}</TableCell>
              <TableCell>{g.roomNumber}</TableCell>
              <TableCell>{CATEGORY_LABELS[g.category]}</TableCell>
              <TableCell>
                <Chip size="small" label={PRIORITY_LABELS[g.priority]} color={priorityColor(g.priority)} />
              </TableCell>
              <TableCell>
                <Chip size="small" label={STATUS_LABELS[g.status]} color={statusColor(g.status)} variant="outlined" />
              </TableCell>
              <TableCell>{formatDate(g.createdAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
