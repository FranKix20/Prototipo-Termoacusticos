"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("admin_authenticated") === "true"
    if (isAuthenticated) {
      router.push("/admin")
    } else {
      router.push("/login")
    }
  }, [router])

  return null
}
