"use client"

import { useRouter } from "next/navigation"
import { Home, FileText, History, Settings, LogOut, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MainNav({ currentPage }: { currentPage: string }) {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("admin_authenticated")
    router.push("/login")
  }

  const navItems = [
    { id: "inicio", label: "Inicio", icon: Home, path: "/admin" },
    { id: "cotizar", label: "Cotizar", icon: FileText, path: "/admin/cotizar" },
    { id: "historial", label: "Historial", icon: History, path: "/admin/historial" },
    { id: "modificar", label: "Modificar", icon: Edit, path: "/admin/modificar" },
    { id: "configuracion", label: "Configuración", icon: Settings, path: "/admin/configuracion" },
  ]

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
