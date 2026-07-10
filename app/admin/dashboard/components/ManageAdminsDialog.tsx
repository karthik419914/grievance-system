"use client";

import { useState, useEffect, useTransition } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import { addAdminAction, fetchAdminsAction, deleteAdminAction } from "../actions";

interface ManageAdminsDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function ManageAdminsDialog({ open, onClose }: ManageAdminsDialogProps) {
  const [admins, setAdmins] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadAdmins = async () => {
    setLoading(true);
    setError(null);
    const result = await fetchAdminsAction();
    if (result.success) {
      setAdmins(result.admins || []);
    } else {
      setError(result.error || "Failed to load admins.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (open) {
      loadAdmins();
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setSuccess(null);
      setError(null);
    }
  }, [open]);

  const handleClose = () => {
    onClose();
  };

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    startTransition(async () => {
      const result = await addAdminAction(cleanEmail, password);
      if (result.success) {
        setSuccess(`Admin "${cleanEmail}" added successfully.`);
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        loadAdmins();
      } else {
        setError(result.error);
      }
    });
  };

  const handleDeleteAdmin = (targetEmail: string) => {
    if (targetEmail === "karthik419914@gmail.com") return;
    
    if (!confirm(`Are you sure you want to delete admin "${targetEmail}"?`)) {
      return;
    }

    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await deleteAdminAction(targetEmail);
      if (result.success) {
        setSuccess(`Admin "${targetEmail}" deleted successfully.`);
        loadAdmins();
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Manage Admins</DialogTitle>
      
      <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        {/* Existing Admins List */}
        <Box>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Current Administrators
          </Typography>
          
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <Paper variant="outlined" sx={{ maxHeight: 200, overflow: "auto", borderRadius: 2 }}>
              <List disablePadding>
                {admins.map((adminEmail, index) => {
                  const isMain = adminEmail === "karthik419914@gmail.com";
                  return (
                    <Box key={adminEmail}>
                      {index > 0 && <Divider />}
                      <ListItem sx={{ py: 1 }}>
                        <ListItemText
                          primary={adminEmail}
                          secondary={isMain ? "Main Administrator (System Owner)" : "Administrator"}
                          primaryTypographyProps={{ fontWeight: isMain ? 600 : 400 }}
                        />
                        {!isMain && (
                          <ListItemSecondaryAction>
                            <IconButton
                              edge="end"
                              aria-label="delete"
                              onClick={() => handleDeleteAdmin(adminEmail)}
                              disabled={isPending}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        )}
                      </ListItem>
                    </Box>
                  );
                })}
              </List>
            </Paper>
          )}
        </Box>

        <Divider />

        {/* Add New Admin Form */}
        <Box component="form" onSubmit={handleAddAdmin}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
            Add New Administrator
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="Admin Email"
              type="email"
              size="small"
              fullWidth
              required
              disabled={isPending}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              label="Password"
              type="password"
              size="small"
              fullWidth
              required
              disabled={isPending}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              helperText="At least 6 characters"
            />

            <TextField
              label="Confirm Password"
              type="password"
              size="small"
              fullWidth
              required
              disabled={isPending}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isPending}
              sx={{ alignSelf: "flex-end", textTransform: "none", fontWeight: 600 }}
            >
              {isPending ? "Adding..." : "Add Admin"}
            </Button>
          </Stack>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} disabled={isPending}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
