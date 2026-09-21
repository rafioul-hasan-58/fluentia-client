import { AdminUsersView } from "@/views/admin/AdminUsersView";

export const metadata = {
  title: "Learners & Users | Fluentia Admin",
  description: "User directory and role permissions management",
};

export default function AdminUsersPage() {
  return <AdminUsersView />;
}
