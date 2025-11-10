"use client"
import Link from "next/link"
import { Card } from "@/components/ui/card"

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
