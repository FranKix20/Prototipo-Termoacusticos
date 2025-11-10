"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, FileText, History, Settings, LogOut, Edit3 } from "lucide-react"

export function AdminHeader() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("admin_authenticated")
    router.push("/login")
  }

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/")

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-teal-600">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Logo y nombre TermoAcusticos */}
        <Link href="/admin" className="flex items-center gap-3">
          <div className="bg-white rounded px-2 py-1">
            <span className="font-bold text-teal-600 text-lg">TERMO</span>
            <span className="font-bold text-yellow-500 text-lg">ACÚSTICOS</span>
          </div>
        </Link>

        {/* Navegación principal */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/admin"
            className={`flex items-center gap-1 sm:gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              pathname === "/admin" ? "bg-white/20 text-white" : "text-white/80 hover:bg-white/10"
            }`}
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Inicio</span>
          </Link>

          <Link
            href="/admin/cotizar"
            className={`flex items-center gap-1 sm:gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              isActive("/admin/cotizar") ? "bg-white/20 text-white" : "text-white/80 hover:bg-white/10"
            }`}
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Cotizar</span>
          </Link>

          <Link
            href="/admin/historial"
            className={`flex items-center gap-1 sm:gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              isActive("/admin/historial") ? "bg-white/20 text-white" : "text-white/80 hover:bg-white/10"
            }`}
          >
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">Historial</span>
          </Link>

          {/* Modificar con dropdown */}
          <div className="relative group">
            <button
              className={`flex items-center gap-1 sm:gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive("/admin/modificar") ? "bg-white/20 text-white" : "text-white/80 hover:bg-white/10"
              }`}
            >
              <Edit3 className="h-4 w-4" />
              <span className="hidden sm:inline">Modificar</span>
            </button>

            {/* Dropdown menu */}
            <div className="absolute left-0 top-full hidden group-hover:block bg-card border border-border rounded-md shadow-lg py-1 w-44 z-50">
              <Link
                href="/admin/modificar/tipos"
                className="block px-4 py-2 hover:bg-secondary text-sm text-foreground"
              >
                Tipos
              </Link>
              <Link
                href="/admin/modificar/materiales"
                className="block px-4 py-2 hover:bg-secondary text-sm text-foreground"
              >
                Materiales
              </Link>
              <Link
                href="/admin/modificar/cristales"
                className="block px-4 py-2 hover:bg-secondary text-sm text-foreground"
              >
                Cristales
              </Link>
              <Link
                href="/admin/modificar/colores"
                className="block px-4 py-2 hover:bg-secondary text-sm text-foreground"
              >
                Colores
              </Link>
              <Link
                href="/admin/modificar/perfiles"
                className="block px-4 py-2 hover:bg-secondary text-sm text-foreground"
              >
                Perfiles
              </Link>
              <Link
                href="/admin/modificar/quincalleria"
                className="block px-4 py-2 hover:bg-secondary text-sm text-foreground"
              >
                Quincallería
              </Link>
              <Link
                href="/admin/modificar/imagenes"
                className="block px-4 py-2 hover:bg-secondary text-sm text-foreground"
              >
                Imágenes
              </Link>
            </div>
          </div>

          <Link
            href="/admin/configuracion"
            className={`flex items-center gap-1 sm:gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              isActive("/admin/configuracion") ? "bg-white/20 text-white" : "text-white/80 hover:bg-white/10"
            }`}
          >
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Configuración</span>
          </Link>

          <Button onClick={handleLogout} variant="ghost" size="sm" className="text-white hover:bg-white/10">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline ml-1">Cerrar</span>
          </Button>
        </nav>
      </div>
    </header>
  )
}
