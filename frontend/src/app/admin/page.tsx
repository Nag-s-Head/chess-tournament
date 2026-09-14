import { StatusCard } from "@/lib/components/StatusCard";

export default function AdminPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      <StatusCard
        title="Tournaments"
        variant="info"
        description="View and edit tournaments"
        href="tournaments/create"
      />
      <StatusCard
        title="Admins"
        variant="security"
        description="View admins, and audit logs"
        href="admins"
      />
    </div>
  );
}
