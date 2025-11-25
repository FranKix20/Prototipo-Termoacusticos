"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { GestionUsuarios } from "@/components/gestion-usuarios"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ShieldAlert } from "lucide-react"
import Link from "next/link"

export default function ConfiguracionPage() {
  const router = useRouter()
  const [showAccessDenied, setShowAccessDenied] = useState(false)

  useEffect(() => {
    const rol = localStorage.getItem("admin_rol")
    if (rol !== "administrador") {
      setShowAccessDenied(true)
    }
  }, [router])

  if (showAccessDenied) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive" className="border-red-500">
          <ShieldAlert className="h-5 w-5" />
          <AlertDescription className="text-base">
            <strong>Acceso Denegado:</strong> Esta sección está disponible solo para administradores.
          </AlertDescription>
        </Alert>

        <div className="flex flex-col items-center justify-center py-12 text-center">
          <ShieldAlert className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Permisos Insuficientes</h2>
          <p className="text-muted-foreground mb-6">
            No tienes autorización para acceder a la configuración del sistema.
          </p>
          <Link
            href="/admin"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Configuración</h1>
        <p className="text-muted-foreground">Administra usuarios y parámetros del sistema</p>
      </div>

      <GestionUsuarios />
    </div>
  )
}
