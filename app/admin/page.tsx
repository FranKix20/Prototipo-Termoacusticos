"use client"

import Link from "next/link"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Edit3, History, Settings, ArrowRight } from "lucide-react"

export default function AdminHome() {
  const menuItems = [
    {
      icon: FileText,
      title: "Crear Cotización",
      description: "Genera una nueva cotización de termopaneles",
      href: "/admin/cotizar",
    },
    {
      icon: Edit3,
      title: "Modificar Productos",
      description: "Edita precios, materiales y especificaciones",
      href: "/admin/modificar/tipos",
    },
    {
      icon: History,
      title: "Historial",
      description: "Consulta todas las cotizaciones realizadas",
      href: "/admin/historial",
    },
    {
      icon: Settings,
      title: "Configuración",
      description: "Ajusta parámetros globales del sistema",
      href: "/admin/configuracion",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Bienvenido a TermoAcusticos</h1>
        <p className="text-muted-foreground">Sistema de cotización de termopaneles y acústica</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href}>
              <Card className="h-full transition-shadow hover:shadow-lg cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        {item.title}
                      </CardTitle>
                      <CardDescription className="mt-2">{item.description}</CardDescription>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
