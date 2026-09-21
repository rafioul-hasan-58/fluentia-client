import { AdminAttemptsView } from "@/views/admin/AdminAttemptsView";

export const metadata = {
  title: "Test Attempts | Fluentia Admin",
  description: "View all learner placement test attempts, sectional evaluations, and diagnostic reports",
};

export default function AdminAttemptsPage() {
  return <AdminAttemptsView />;
}
