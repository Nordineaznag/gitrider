"use client";

import { useAuth } from "@/lib/auth-context";
import { DashboardSkeleton } from "@/components/ui/loading-skeleton";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import components
const LoginForm = dynamic(
  () => import("@/components/auth/login-form").then(mod => ({ default: mod.LoginForm })),
  { loading: () => <DashboardSkeleton /> }
);

const UserDashboard = dynamic(
  () => import("@/components/user/user-dashboard").then(mod => ({ default: mod.UserDashboard })),
  { loading: () => <DashboardSkeleton /> }
);

const DriverDashboard = dynamic(
  () => import("@/components/driver/driver-dashboard").then(mod => ({ default: mod.DriverDashboard })),
  { loading: () => <DashboardSkeleton /> }
);

export default function Home() {
  const { user, profile, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading skeleton while authenticating
  if (loading || !mounted) {
    return (
      <div className="min-h-screen bg-[#1a1d1f] flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-[#F2F2F7] flex items-center justify-center p-4">
        <LoginForm />
      </div>
    );
  }

  // Show appropriate dashboard based on user role
  return (
    <div className="min-h-screen bg-[#F2F2F7]">
      {profile.role === "driver" ? <DriverDashboard /> : <UserDashboard />}
    </div>
  );
}
