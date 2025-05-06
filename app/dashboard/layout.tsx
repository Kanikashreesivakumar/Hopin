"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/AuthContext"
import DynamicNavbar from "@/components/dynamic-navbar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  const userName = user?.name || "Passenger";
  const userAvatar = user?.avatar || "/placeholder.svg?height=32&width=32";

  if (loading) return null;
  if (!user) return null;
  return <>
  <DynamicNavbar role={user?.role || "passenger"} userName={userName} userAvatar={userAvatar} />
  {children}</>;
}
