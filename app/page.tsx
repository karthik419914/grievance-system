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
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import MenuIcon from "@mui/icons-material/Menu";
import HealthAndSafetyOutlinedIcon from "@mui/icons-material/HealthAndSafetyOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import CloseIcon from "@mui/icons-material/Close";
import {
  getGrievanceHistory,
  type DeviceGrievanceHistoryItem,
} from "@/lib/storage";

export default function HomePage() {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [history, setHistory] = useState<DeviceGrievanceHistoryItem[]>([]);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [selectedGrievance, setSelectedGrievance] = useState<DeviceGrievanceHistoryItem | null>(null);
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
            {/* Mobile Menu Icon */}
            <Box sx={{ display: { xs: "block", md: "none" } }}>
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
                <Divider />
                <MenuItem component={Link} href="#contact-us" onClick={handleMenuClose}>
                  Contact Us
                </MenuItem>
                <MenuItem component={Link} href="/admin/login" onClick={handleMenuClose}>
                  Admin Login
                </MenuItem>
              </Menu>
            </Box>

            {/* Desktop Navigation Links */}
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ display: { xs: "none", md: "flex" } }}
            >
              <Button component={Link} href="/submit" color="inherit" sx={{ textTransform: "none", fontWeight: 500 }}>
                Submit a Grievance
              </Button>
              <Button component={Link} href="/submit/report" color="inherit" sx={{ textTransform: "none", fontWeight: 500 }}>
                Search Grievance
              </Button>
              <Button component={Link} href="#about-us" color="inherit" sx={{ textTransform: "none", fontWeight: 500 }}>
                About Us
              </Button>
              <Button component={Link} href="#contact-us" color="inherit" sx={{ textTransform: "none", fontWeight: 500 }}>
                Contact Us
              </Button>
              <Button
                component={Link}
                href="/admin/login"
                variant="outlined"
                color="primary"
                sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2 }}
              >
                Admin Login
              </Button>
            </Stack>
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
        {/* Row 1: Hero Text Layout (Left) and Submit a Grievance Card (Right) */}
        <Box sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" }, gap: 4, mt: 4 }}>
          <Box sx={{ flex: { xs: "1 1 auto", lg: "1 1 65%" } }}>
            <Typography variant="h3" gutterBottom sx={{ maxWidth: 680 }}>
              We&apos;re here to listen, support, and act.
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700, mb: 4 }}>
              Use this portal to share a concern about care, staff, food, safety, or facility services. Every submission is reviewed by our team, and we aim to respond quickly while keeping your information secure.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 720, mb: 4, lineHeight: 1.8 }}>
              This portal helps residents, families, and staff report issues clearly and gives teams a consistent way to review them.
            </Typography>
          </Box>

          <Box sx={{ flex: { xs: "1 1 auto", lg: "1 1 35%" }, display: "flex" }}>
            <Paper
              elevation={1}
              sx={{
                p: 4,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <EditNoteOutlinedIcon color="primary" sx={{ fontSize: 34, mb: 1.5 }} />
                <Typography variant="h6" gutterBottom>
                  Submit a Grievance
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.8 }}>
                  Use the secure grievance form to report issues with care, staff, food, or facility services. Your draft is saved automatically while you complete the form.
                </Typography>
              </Box>
              <Button component={Link} href="/submit" variant="contained" size="large" fullWidth>
                Start Now
              </Button>
            </Paper>
          </Box>
        </Box>

        {/* Row 2: Search Grievance and Past Grievances side-by-side */}
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2, mt: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography variant="h6" gutterBottom>
                Search Grievance by ID
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.8 }}>
                Have a reference code from a previous submission? Use it to look up your grievance right here.
              </Typography>
            </Box>
            <Button component={Link} href="/submit/report" variant="outlined" size="large" fullWidth>
              Search by ID
            </Button>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              flex: 1,
              display: "flex",
              flexDirection: "column",
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
              <Stack spacing={2} sx={{ flexGrow: 1, justifyContent: "space-between" }}>
                {/* Show the most recent (first) grievance */}
                <Box
                  onClick={() => setSelectedGrievance(history[0])}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    "&:hover": {
                      bgcolor: "action.hover",
                      borderColor: "primary.main",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    },
                  }}
                >
                  <Typography variant="subtitle2" fontWeight={700}>
                    {history[0].referenceCode}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {history[0].submitterName} • {history[0].category.replace(/_/g, " ")} • {new Date(history[0].createdAt).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, whiteSpace: "pre-wrap" }}>
                    {history[0].description}
                  </Typography>
                </Box>

                {history.length > 1 && (
                  <Button
                    variant="text"
                    onClick={() => setIsHistoryDialogOpen(true)}
                    sx={{ alignSelf: "flex-start", textTransform: "none", mt: 1, fontWeight: 600 }}
                  >
                    Show More ({history.length - 1} more)
                  </Button>
                )}
              </Stack>
            )}
          </Paper>
        </Box>

       <Box id="how-it-works" sx={{ mt: 8, py: 6, textAlign: "center" }}>
        <Typography variant="h4" fontWeight={700} gutterBottom sx={{ mb: 5 }}>
          How It Works
        </Typography>
        
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3, justifyContent: "center", alignItems: "stretch", px: { xs: 1, md: 0 } }}>
          {/* Step 1 */}
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              p: 3.5,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                bgcolor: "primary.main",
                color: "primary.contrastText",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "1.1rem",
                mb: 2,
                boxShadow: "0 2px 8px rgba(25, 118, 210, 0.25)",
              }}
            >
              1
            </Box>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
              Write Details
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              Tell us what happened in simple words. Add your name, email, relation, room or unit, and a short description.
            </Typography>
          </Paper>

          {/* Step 2 */}
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              p: 3.5,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                bgcolor: "primary.main",
                color: "primary.contrastText",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "1.1rem",
                mb: 2,
                boxShadow: "0 2px 8px rgba(25, 118, 210, 0.25)",
              }}
            >
              2
            </Box>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
              Set Urgency
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              Pick the category and how urgent it is so the right team can review and address it promptly.
            </Typography>
          </Paper>

          {/* Step 3 */}
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              p: 3.5,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                bgcolor: "primary.main",
                color: "primary.contrastText",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "1.1rem",
                mb: 2,
                boxShadow: "0 2px 8px rgba(25, 118, 210, 0.25)",
              }}
            >
              3
            </Box>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
              Save Reference
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              Submit your report and keep the reference code to track its progress at any time.
            </Typography>
          </Paper>

          {/* Step 4 */}
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              p: 3.5,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                bgcolor: "primary.main",
                color: "primary.contrastText",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "1.1rem",
                mb: 2,
                boxShadow: "0 2px 8px rgba(25, 118, 210, 0.25)",
              }}
            >
              4
            </Box>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
              Track Status
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              Use the Search by ID card above or the navigation menu to look up your grievance status anytime.
            </Typography>
          </Paper>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 4, fontWeight: 700 }}>
          Note: This form is for non-emergency concerns. In an emergency, contact staff right away.
        </Typography>
       </Box>

       <Box
         sx={{
           display: "flex",
           flexDirection: { xs: "column", md: "row" },
           gap: { xs: 4, md: 6 },
           mt: 8,
         }}
       >
         <Box id="about-us" sx={{ flex: 1, py: 5 }}>
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

         <Box
           id="what-we-do"
           sx={{
             flex: 1,
             py: 5,
             bgcolor: "background.paper",
             borderRadius: 3,
             p: 4,
             border: "1px solid",
             borderColor: "divider",
           }}
         >
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
           Email: <a href="mailto:karthik419914@gmail.com" style={{ color: "inherit", textDecoration: "underline" }}>karthik419914@gmail.com</a>
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

      {/* Dialog for listing all past grievances */}
      <Dialog
        open={isHistoryDialogOpen}
        onClose={() => setIsHistoryDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        scroll="paper"
        PaperProps={{
          sx: { borderRadius: 3, p: 1 }
        }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" fontWeight={700}>
            All Past Grievances
          </Typography>
          <IconButton onClick={() => setIsHistoryDialogOpen(false)} size="small" aria-label="Close popup">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ py: 2 }}>
          <Stack spacing={2}>
            {history.map((item) => (
              <Box
                key={item.referenceCode}
                onClick={() => {
                  setIsHistoryDialogOpen(false);
                  setSelectedGrievance(item);
                }}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  "&:hover": {
                    bgcolor: "action.hover",
                    borderColor: "primary.main",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  },
                }}
              >
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
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 1.5 }}>
          <Button onClick={() => setIsHistoryDialogOpen(false)} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for detailing a specific grievance */}
      <Dialog
        open={Boolean(selectedGrievance)}
        onClose={() => setSelectedGrievance(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, p: 1 }
        }}
      >
        {selectedGrievance && (
          <>
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h6" fontWeight={700}>
                Grievance Details
              </Typography>
              <IconButton onClick={() => setSelectedGrievance(null)} size="small" aria-label="Close details">
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ py: 3 }}>
              <Stack spacing={2.5}>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Reference Code
                  </Typography>
                  <Typography variant="body1" fontWeight={700} sx={{ fontFamily: "monospace", fontSize: "1.1rem" }}>
                    {selectedGrievance.referenceCode}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Date Submitted
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {new Date(selectedGrievance.createdAt).toLocaleString()}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Submitter Name
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {selectedGrievance.submitterName}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Category
                  </Typography>
                  <Typography variant="body2" fontWeight={500} sx={{ textTransform: "capitalize" }}>
                    {selectedGrievance.category.replace(/_/g, " ")}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                    Description
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: "background.default", borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
                    <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                      {selectedGrievance.description}
                    </Typography>
                  </Paper>
                </Box>
              </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 1.5 }}>
              <Button onClick={() => setSelectedGrievance(null)} variant="contained" color="primary">
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
