"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import { loginAction, LoginState } from "./actions";

const initialState: LoginState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="contained" size="large" fullWidth disabled={pending}>
      {pending ? "Signing in..." : "Sign In"}
    </Button>
  );
}

export default function AdminLoginPage() {
  const [state, formAction] = useFormState(loginAction, initialState);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        p: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 4, sm: 5 },
          maxWidth: 420,
          width: "100%",
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <LockOutlinedIcon color="primary" sx={{ fontSize: 32, mb: 1 }} />
        <Typography variant="h5" gutterBottom>
          Admin Sign In
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Sign in to review and manage submitted grievances.
        </Typography>

        {state?.error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {state.error}
          </Alert>
        )}

        <Box component="form" action={formAction} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField name="username" label="Username" fullWidth required autoFocus />
          <TextField name="password" label="Password" type="password" fullWidth required />
          <SubmitButton />
        </Box>

        <Box sx={{ mt: 2 }}>
          <Link href="/" style={{ fontSize: "0.85rem" }}>
            ← Back to home
          </Link>
        </Box>
      </Paper>
    </Box>
  );
}
