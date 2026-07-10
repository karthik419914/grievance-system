"use client";

import { useState, useEffect, type MouseEvent } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import HealthAndSafetyOutlinedIcon from "@mui/icons-material/HealthAndSafetyOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import {
  getGrievanceHistory,
  type DeviceGrievanceHistoryItem,
} from "@/lib/storage";

export default function HomePage() {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [history, setHistory] = useState<DeviceGrievanceHistoryItem[]>([]);
  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => setMenuAnchor(event.currentTarget);
  const handleMenuClose = () => setMenuAnchor(null);

  useEffect(() => {
    setHistory(getGrievanceHistory());
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box component="header" sx={{ py: 3, borderBottom: "1px solid", borderColor: "divider" }}>
        <Container maxWidth="xl" sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1.5, px: { xs: 2, sm: 3, md: 4 } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <HealthAndSafetyOutlinedIcon color="primary" fontSize="large" />
            <Typography variant="h6" fontWeight={700}>
              Grievance System
            </Typography>
          </Box>

          <Box>
            <IconButton onClick={handleMenuOpen} aria-label="Open navigation menu">
              <MenuIcon />
            </IconButton>
            <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
              <MenuItem component={Link} href="/submit" onClick={handleMenuClose}>
                Submit a Grievance
              </MenuItem>
              <MenuItem component={Link} href="/submit/report" onClick={handleMenuClose}>
                Search Grievance
              </MenuItem>
              <MenuItem component={Link} href="#about-us" onClick={handleMenuClose}>
                About Us
              </MenuItem>
                  <MenuItem component={Link} href="#what-we-do" onClick={handleMenuClose}>
                What We Do
              </MenuItem>
                  <Divider />
                  <MenuItem component={Link} href="#contact-us" onClick={handleMenuClose}>
                    Contact Us
                  </MenuItem>
              <MenuItem component={Link} href="/admin/login" onClick={handleMenuClose}>
                Admin Login
              </MenuItem>
            </Menu>
          </Box>
        </Container>
      </Box>

      <Container
        maxWidth="xl"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          py: 8,
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Typography variant="h3" gutterBottom sx={{ maxWidth: 680 }}>
          We&apos;re here to listen, support, and act.
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700, mb: 4 }}>
          Use this portal to share a concern about care, staff, food, safety, or facility services. Every submission is reviewed by our team, and we aim to respond quickly while keeping your information secure.
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 720, mb: 4, lineHeight: 1.8 }}>
          This portal helps residents, families, and staff report issues clearly and gives teams a consistent way to review them.
        </Typography>

       <Box sx={{ mt: 4, display: "flex", flexWrap: "wrap", gap: 2 }}>
        <Paper
          elevation={1}
          sx={{
            mt: 4,
            p: 4,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            flex: "1 1 320px",
          }}
        >
          <EditNoteOutlinedIcon color="primary" sx={{ fontSize: 34, mb: 1.5 }} />
          <Typography variant="h6" gutterBottom>
            Submit a Grievance
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.8 }}>
            Use the secure grievance form to report issues with care, staff, food, or facility services. Your draft is saved automatically while you complete the form.
          </Typography>
          <Button component={Link} href="/submit" variant="contained" size="large" fullWidth>
            Start Now
          </Button>
        </Paper>
        <Paper
          elevation={0}
          sx={{
            mt: 4,
            p: 4,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            flex: "1 1 320px",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Search Grievance by ID
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.8 }}>
            Have a reference code from a previous submission? Use it to look up your grievance right here.
          </Typography>
          <Button component={Link} href="/submit/report" variant="outlined" size="large" fullWidth>
            Search by ID
          </Button>
        </Paper>
        <Paper
          elevation={0}
          sx={{
            mt: 4,
            p: 4,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            flex: "1 1 320px",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Past grievances from this device
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            All grievances submitted from this browser are shown here.
          </Typography>

          {history.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No past grievances submitted from this device yet.
            </Typography>
          ) : (
            <Stack spacing={2}>
              {history.map((item) => (
                <Box key={item.referenceCode} sx={{ p: 2, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
                  <Typography variant="subtitle2" fontWeight={700}>
                    {item.referenceCode}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {item.submitterName} • {item.category.replace(/_/g, " ")} • {new Date(item.createdAt).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, whiteSpace: "pre-wrap" }}>
                    {item.description}
                  </Typography>
                </Box>
              ))}
            </Stack>
          )}
        </Paper>
       </Box>

       <Box id="how-it-works" sx={{ mt: 6, py: 5 }}>
        <Typography variant="h4" gutterBottom>
          How It Works
        </Typography>
        <Box component="ol" sx={{ pl: 3, color: "text.secondary", lineHeight: 1.8 }}>
          <Box component="li" sx={{ mb: 2 }}>
            Tell us what happened in simple words. Add your name, email, relation, room or unit, and a short issue description.
          </Box>
          <Box component="li" sx={{ mb: 2 }}>
            Pick the category and how urgent it is so the right team can see it.
          </Box>
          <Box component="li" sx={{ mb: 2 }}>
            Submit your report and keep the reference code for later.
          </Box>
          <Box component="li">
            Use the Search by ID card above or the menu to look up your grievance anytime.
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontWeight: 700 }}>
          Note: This form is for non-emergency concerns. In an emergency, contact staff right away.
        </Typography>
       </Box>

       <Box id="about-us" sx={{ mt: 8, py: 5 }}>
         <Typography variant="h4" gutterBottom>
           About Us
         </Typography>
         <Typography variant="body1" color="text.secondary" sx={{ mb: 2, lineHeight: 1.8 }}>
           Grievance System is a professional organizational portal built to help care homes, community providers, and support teams gather feedback and resolve concerns quickly.
           We believe every voice matters, and our platform makes it easy to report issues, track progress, and improve service quality.
         </Typography>
         <Typography variant="body1" color="text.secondary" sx={{ mb: 2, lineHeight: 1.8 }}>
           This site is designed as a reliable, secure, and user-friendly tool for housing communities and healthcare providers who need a formal process for managing grievances.
         </Typography>
       </Box>

       <Box id="what-we-do" sx={{ py: 5, bgcolor: "background.paper", borderRadius: 3, p: 4, border: "1px solid", borderColor: "divider" }}>
         <Typography variant="h4" gutterBottom>
           What We Do
         </Typography>
         <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.8 }}>
           We provide an easy-to-use grievance workflow that helps your organization:
         </Typography>
         <Box component="ul" sx={{ pl: 3, mb: 2, color: "text.secondary", lineHeight: 1.8 }}>
           <Box component="li" sx={{ mb: 1 }}>
             Capture concerns clearly with categories, priorities, and supporting details.
           </Box>
           <Box component="li" sx={{ mb: 1 }}>
             Keep submissions secure while allowing anonymous or identified reporting.
           </Box>
           <Box component="li" sx={{ mb: 1 }}>
             Enable administrators to review, filter, and update grievance status in one place.
           </Box>
           <Box component="li">
             Save drafts automatically so users can pause and return without losing progress.
           </Box>
         </Box>
         <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>
           Important: All grievances are recorded for review, tracked for action, and managed through a consistent, documented process.
         </Typography>
       </Box>


       <Box id="contact-us" sx={{ mt: 6, py: 5, bgcolor: "background.paper", borderRadius: 3, p: 4, border: "1px solid", borderColor: "divider" }}>
         <Typography variant="h4" gutterBottom>
           Contact Us
         </Typography>
         <Typography variant="body2" color="text.secondary" sx={{ mb: 1, lineHeight: 1.8 }}>
           Need help using the grievance portal? Reach out to our support team.
         </Typography>
         <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
           Address: 123 Careway Lane, Support City, CA 90001
         </Typography>
         <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
           Email: karthik419914@gmail.com
         </Typography>
         <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
           Phone: (555) 012-3456
         </Typography>
         <Typography variant="body2" color="text.secondary">
           Office hours: Monday to Friday, 9:00 AM – 5:00 PM
         </Typography>
       </Box>

       <Box sx={{ mt: 6, py: 6, textAlign: "center" }}>
         <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
           Copyright © 2026 Grievance System. All rights reserved.
         </Typography>
         <Typography variant="caption" color="text.secondary">
           This portal is intended for submitting formal concerns and improving service delivery. Please provide accurate details and avoid false or malicious reports.
         </Typography>
       </Box>
      </Container>

      <Box component="footer" sx={{ py: 3, textAlign: "center" }}>
        <Typography variant="caption" color="text.secondary">
          If this is a medical emergency, please contact staff directly instead of using this form.
        </Typography>
      </Box>
    </Box>
  );
}
