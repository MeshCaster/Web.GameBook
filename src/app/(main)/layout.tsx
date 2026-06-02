import { SidebarNav } from "@/components/layout/sidebar-nav";
import { MobileNav } from "@/components/layout/mobile-nav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#1E1440" }}>
      <SidebarNav />
      <MobileNav />
      {/* Main content: push right on desktop for sidebar, pad bottom on mobile for nav */}
      <main className="lg:ml-[240px] pb-24 lg:pb-0 min-h-screen">
        {children}
      </main>
    </div>
  );
}
