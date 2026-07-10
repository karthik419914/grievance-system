import { getAllGrievances, getFirestoreConfigStatus, isUsingFirestore } from "@/lib/db";
import { isMainAdmin } from "@/lib/auth";
import DashboardClient from "./components/DashboardClient";

export const metadata = {
  title: "Admin Dashboard | Grievance System",
};

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const grievances = await getAllGrievances();
  const usingFirestore = isUsingFirestore();
  const firestoreStatus = getFirestoreConfigStatus();
  const isMain = await isMainAdmin();

  return (
    <DashboardClient
      initialGrievances={grievances}
      usingFirestore={usingFirestore}
      firestoreConfigured={firestoreStatus.configured}
      firestoreMissing={firestoreStatus.missing}
      isMainAdmin={isMain}
    />
  );
}
