"use client";

import { createTheme } from "@mui/material/styles";

/**
 * Design direction: this portal is used by elderly residents, their
 * families, and nursing home staff — often on shared tablets in common
 * areas. The palette leans toward a muted, sage-teal (steady, clinical
 * trust without feeling cold) against a warm off-white, with generous
 * type sizes and touch targets rather than dense, compact UI.
 */
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2F6F62", // sage teal — calm, trustworthy, not sterile
      light: "#5C9186",
      dark: "#1F4E44",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#B5651D", // warm amber-brown accent, used sparingly
    },
    background: {
      default: "#FAF8F4",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#20261F",
      secondary: "#5B6459",
    },
    error: { main: "#B3261E" },
    warning: { main: "#B5651D" },
    info: { main: "#2A5C8A" },
    success: { main: "#2F6F41" },
    divider: "#E3DFD5",
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: "var(--font-body), 'Segoe UI', Arial, sans-serif",
    h1: { fontFamily: "var(--font-display), Georgia, serif" },
    h2: { fontFamily: "var(--font-display), Georgia, serif" },
    h3: { fontFamily: "var(--font-display), Georgia, serif", fontWeight: 600 },
    h4: { fontFamily: "var(--font-display), Georgia, serif", fontWeight: 600 },
    h5: { fontFamily: "var(--font-display), Georgia, serif", fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
    body1: { fontSize: "1.05rem", lineHeight: 1.6 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          paddingTop: 10,
          paddingBottom: 10,
          paddingLeft: 22,
          paddingRight: 22,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },
  },
});

export default theme;
