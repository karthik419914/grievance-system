"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Link from "next/link";

interface SubmissionResponse {
  submission: {
    referenceCode: string;
    status: string;
    createdAt: string;
    description: string;
    submitterName: string;
  } | null;
  error?: string;
}

export default function ReportLookupPage() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<SubmissionResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const lookupReport = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/submit/api/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referenceCode: code.trim().toUpperCase() }),
      });
      const data = (await response.json()) as SubmissionResponse;
      setResult(data);
    } catch {
      setResult({ submission: null, error: "Unable to lookup the report right now." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: { xs: 4, sm: 8 } }}>
      <Container maxWidth="sm">
        <Typography variant="h4" gutterBottom>
          Search My Report
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Enter the code shown after submission to view the status of your report.
        </Typography>

        <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
          <Box component="form" onSubmit={lookupReport} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Reference Code"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              inputProps={{ maxLength: 5, style: { textTransform: "uppercase" } }}
              fullWidth
              required
            />
            <Button type="submit" variant="contained" size="large" disabled={loading || !code.trim()}>
              {loading ? "Looking up..." : "Find my report"}
            </Button>
          </Box>

          {result && (
            <Box sx={{ mt: 4 }}>
              {result.error ? (
                <Typography variant="body2" color="error">
                  {result.error}
                </Typography>
              ) : result.submission ? (
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2">Reference Code</Typography>
                    <Typography variant="body2" fontFamily="monospace">
                      {result.submission.referenceCode}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Status</Typography>
                    <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
                      {result.submission.status.replace("_", " ")}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Submitted By</Typography>
                    <Typography variant="body2">{result.submission.submitterName}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Submitted On</Typography>
                    <Typography variant="body2">
                      {new Date(result.submission.createdAt).toLocaleString()}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Issue</Typography>
                    <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                      {result.submission.description}
                    </Typography>
                  </Box>
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No report found for that code.
                </Typography>
              )}
            </Box>
          )}
        </Paper>

        <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-start", gap: 2 }}>
          <Button component={Link} href="/" variant="outlined">
            Back to home
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
