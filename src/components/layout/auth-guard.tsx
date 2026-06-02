"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/use-auth";

const PUBLIC_PATHS = ["/onboarding", "/sign-in", "/sign-up", "/forgot-password", "/auth/callback"];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  useEffect(() => {
    if (loading) return;

    if (!user && !isPublic) {
      router.replace("/onboarding");
    }

    if (user && isPublic && pathname !== "/auth/callback") {
      router.replace("/home");
    }
  }, [user, loading, isPublic, pathname, router]);

  if (loading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ backgroundColor: "#1E1440" }}
      >
        <div
          className="w-6 h-6 border-2 rounded-full animate-spin"
          style={{ borderColor: "#7B35FF", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  if (!user && !isPublic) return null;
  if (user && isPublic && pathname !== "/auth/callback") return null;

  return <>{children}</>;
}