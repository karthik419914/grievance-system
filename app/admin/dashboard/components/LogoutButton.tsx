"use client";

import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import { logoutAction } from "../actions";

export default function LogoutButton() {
  return (
    <form action={logoutAction}>
      <Button type="submit" startIcon={<LogoutIcon />} color="inherit">
        Sign Out
      </Button>
    </form>
  );
}
