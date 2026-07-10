"use client";

import { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Link from "next/link";

import { getSavedSubmissionIds } from "../useSubmissions";
import { Grievance } from "@/lib/types";

interface ApiResponse {
  submissions: Grievance[];
}

export default function MySubmissions() {
  const [codes, setCodes] = useState<string[]>([]);
  const [submissions, setSubmissions] = useState<Grievance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCodes(getSavedSubmissionIds());
  }, []);

  useEffect(() => {
    if (codes.length === 0) {
      setSubmissions([]);
      return;
    }

    let isActive = true;
    setLoading(true);
    setError(null);

    fetch("/submit/api/my-submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codes }),
    })
      .then((response) => response.json() as Promise<ApiResponse>)
      .then((data) => {
        if (!isActive) return;
        setSubmissions(data.submissions);
      })
      .catch(() => {
        if (!isActive) return;
        setError("Unable to load your submissions right now.");
      })
      .finally(() => {
        if (!isActive) return;
        setLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [codes]);

  const sortedSubmissions = useMemo(
    () => [...submissions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [submissions]
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Submissions
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        These are the grievances submitted from this browser/device. Status updates are pulled from the server.
      </Typography>

      {codes.length === 0 ? (
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
          <Typography variant="h6" gutterBottom>
            No submissions
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Once you submit a grievance, it will appear here with its current status.
          </Typography>
          <Button component={Link} href="/submit" variant="contained">
            Submit a grievance
          </Button>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {error && (
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
              <Typography variant="body2" color="error">
                {error}
              </Typography>
            </Paper>
          )}

          {loading && (
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
              <Typography variant="body2" color="text.secondary">
                Loading your submissions...
              </Typography>
            </Paper>
          )}

          {sortedSubmissions.map((submission) => (
            <Paper key={submission.id} elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
              <Stack spacing={1}>
                    <Typography variant="subtitle2">Reference Code</Typography>
                <Typography variant="body2" fontFamily="monospace" sx={{ wordBreak: "break-all" }}>
                      {submission.referenceCode}
                </Typography>

                <Typography variant="subtitle2">Status</Typography>
                <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
                  {submission.status.replace("_", " ")}
                </Typography>

                <Typography variant="subtitle2">Submitted on</Typography>
                <Typography variant="body2">
                  {new Date(submission.createdAt).toLocaleString()}
                </Typography>

                <Typography variant="subtitle2">Issue</Typography>
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                  {submission.description}
                </Typography>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}

      <Box sx={{ mt: 4 }}>
        <Button component={Link} href="/" variant="outlined">
          Back to home
        </Button>
      </Box>
    </Box>
  );
}
