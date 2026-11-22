import { Spinner } from "@/components/ui";
// The dashboard layout redirects to /dashboard/<role> once the session is known.
export default function DashboardIndex() { return <Spinner label="Loading dashboard…" />; }
