import Navbar from "@/components/NavbarDashboard";
import { ModeToggle } from "@/components/ui/toggle-mode-theme";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}
