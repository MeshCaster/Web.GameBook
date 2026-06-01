"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/use-auth";

export default function RootPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (user) {
      router.replace("/home");
    } else {
      router.replace("/onboarding");
    }
  }, [user, loading, router]);

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{ backgroundColor: "#080810" }}
    >
      <div
        className="w-6 h-6 border-2 rounded-full animate-spin"
        style={{ borderColor: "#7B35FF", borderTopColor: "transparent" }}
      />
    </div>
  );
}
