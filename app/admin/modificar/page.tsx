"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ShieldAlert } from "lucide-react"

const sections = [
  { id: "tipos", label: "Tipos", path: "/admin/modificar/tipos" },
  { id: "materiales", label: "Materiales", path: "/admin/modificar/materiales" },
  { id: "cristales", label: "Cristales", path: "/admin/modificar/cristales" },
  { id: "colores", label: "Colores", path: "/admin/modificar/colores" },
  { id: "perfiles", label: "Perfiles", path: "/admin/modificar/perfiles" },
  { id: "quincalleria", label: "Quincallería", path: "/admin/modificar/quincalleria" },
  { id: "imagenes", label: "Imágenes", path: "/admin/modificar/imagenes" },
]

export default function ModificarPage() {
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
            No tienes autorización para modificar la configuración del sistema.
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
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/admin" className="hover:text-foreground">
          Home
        </Link>
        <span>›</span>
        <span>Modificar</span>
      </div>

      <h1 className="text-3xl font-bold">Selecciona un tipo</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <Link key={section.id} href={section.path}>
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full flex items-center justify-center">
              <h2 className="text-xl font-semibold">{section.label}</h2>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
