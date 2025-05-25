"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/AuthContext"
import DynamicNavbar from "@/components/dynamic-navbar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
 
  type UserWithAvatar = typeof user & { avatar?: string };
  const userWithAvatar = user as UserWithAvatar;

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [loading, user, router]);

  const userName = user?.name || "Passenger";
  const userAvatar = userWithAvatar?.avatar || "/placeholder.svg?height=32&width=32";

  if (loading) return null;
  if (!user) return null;
  return (
    <>
      <DynamicNavbar role={user?.role || "passenger"} userName={userName} userAvatar={userAvatar} />
      {children}
    </>
  );
}
