import Navbar from "@/components/Navbar";

export default function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Navbar profileItem={false} dashboardItem={true} />
      {children}
    </div>
  );
}
