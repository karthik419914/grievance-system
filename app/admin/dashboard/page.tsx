import { getAllGrievances } from "@/lib/db";
import DashboardClient from "./components/DashboardClient";

export const metadata = {
  title: "Admin Dashboard | Grievance System",
};

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const grievances = await getAllGrievances();

  return <DashboardClient initialGrievances={grievances} />;
}
