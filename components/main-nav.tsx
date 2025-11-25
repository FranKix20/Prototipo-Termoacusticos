"use client"

import { useRouter } from "next/navigation"
import { Home, FileText, History, Settings, LogOut, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

export function MainNav({ currentPage }: { currentPage: string }) {
  const router = useRouter()
  const [userRole, setUserRole] = useState<string>("")

  useEffect(() => {
    const rol = localStorage.getItem("admin_rol") || "usuario"
    setUserRole(rol)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("admin_authenticated")
    localStorage.removeItem("admin_rol")
    localStorage.removeItem("admin_usuario_id")
    localStorage.removeItem("admin_email")
    localStorage.removeItem("admin_nombre")
    router.push("/login")
  }

  const allNavItems = [
    { id: "inicio", label: "Inicio", icon: Home, path: "/admin", allowedRoles: ["administrador", "usuario"] },
    {
      id: "cotizar",
      label: "Cotizar",
      icon: FileText,
      path: "/admin/cotizar",
      allowedRoles: ["administrador", "usuario"],
    },
    {
      id: "historial",
      label: "Historial",
      icon: History,
      path: "/admin/historial",
      allowedRoles: ["administrador", "usuario"],
    },
    { id: "modificar", label: "Modificar", icon: Edit, path: "/admin/modificar", allowedRoles: ["administrador"] },
    {
      id: "configuracion",
      label: "Configuración",
      icon: Settings,
      path: "/admin/configuracion",
      allowedRoles: ["administrador"],
    },
  ]

  const navItems = allNavItems.filter((item) => item.allowedRoles.includes(userRole))

  return (
    <nav className="bg-teal-600 text-white px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-8">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id
          return (
            <button
              key={item.id}
              onClick={() => router.push(item.path)}
              className={`flex items-center gap-2 pb-2 border-b-2 transition-colors ${
                isActive ? "border-white text-white" : "border-transparent text-teal-100 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          )
        })}
      </div>
      <Button onClick={handleLogout} variant="ghost" className="text-white hover:bg-teal-700 flex items-center gap-2">
        <LogOut className="w-5 h-5" />
        <span>Cerrar Sesión</span>
      </Button>
    </nav>
  )
}
