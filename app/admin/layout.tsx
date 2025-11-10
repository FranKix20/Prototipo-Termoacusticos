"use client"

import { useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { AdminHeader } from "@/components/admin-header"

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("admin_authenticated") === "true"
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
