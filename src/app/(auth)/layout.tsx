import { AuthBackground } from "@/components/atmosphere/auth-background";
import { AuthHeader } from "@/components/layout/auth-header";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen" style={{ backgroundColor: "#1E1440" }}>
      <AuthBackground />
      <AuthHeader />
      <div className="relative z-10 pt-20">{children}</div>
    </div>
  );
}
