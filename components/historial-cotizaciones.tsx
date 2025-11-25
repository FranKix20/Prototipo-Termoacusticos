"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, Trash2 } from "lucide-react"

interface Cotizacion {
  id: number
  cliente_nombre: string
  cliente_rut: string | null
  cliente_correo: string
  cliente_telefono: string | null
  cliente_direccion: string | null
  precio_total: number
  estado: string
  notas: string | null
  created_at: string
  updated_at: string
}

export function HistorialCotizaciones() {
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([])
  const [filtroEstado, setFiltroEstado] = useState<"todas" | "pendiente" | "confirmada" | "completada">("todas")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCotizaciones()
  }, [])

  const loadCotizaciones = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/cotizaciones")
      const data = await response.json()

      if (data.success) {
        setCotizaciones(data.cotizaciones)
      }
    } catch (error) {
      console.error("Error loading cotizaciones:", error)
    } finally {
      setLoading(false)
    }
  }

  const cotizacionesFiltradas =
    filtroEstado === "todas" ? cotizaciones : cotizaciones.filter((c) => c.estado === filtroEstado)

  const handleCambiarEstado = async (id: number, nuevoEstado: string) => {
    try {
      const response = await fetch(`/api/cotizaciones/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      })

      if (response.ok) {
        await loadCotizaciones()
      }
    } catch (error) {
      console.error("Error updating estado:", error)
    }
  }

  const handleDescargarPDF = (cotizacion: Cotizacion) => {
    try {
      const notasData = cotizacion.notas ? JSON.parse(cotizacion.notas) : {}
      const pdfUrl = notasData.pdfUrl

      if (pdfUrl) {
        window.open(pdfUrl, "_blank")
      } else {
        alert("PDF no disponible para esta cotización")
      }
    } catch (error) {
      console.error("Error downloading PDF:", error)
      alert("Error al descargar el PDF")
    }
  }

  const handleEliminar = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar esta cotización?")) {
      return
    }

    try {
      const response = await fetch(`/api/cotizaciones/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await loadCotizaciones()
      }
    } catch (error) {
      console.error("Error deleting cotizacion:", error)
    }
  }

  const getColorEstado = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return "bg-yellow-100 text-yellow-800"
      case "confirmada":
        return "bg-blue-100 text-blue-800"
      case "completada":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRut = (cotizacion: Cotizacion) => {
    return cotizacion.cliente_rut || "N/A"
  }

  if (loading) {
    return (
      <Card className="p-6 bg-card">
        <p className="text-center text-muted-foreground">Cargando historial...</p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-foreground">Historial de Cotizaciones</h2>

          <div className="flex gap-2">
            <Button
              variant={filtroEstado === "todas" ? "default" : "outline"}
              onClick={() => setFiltroEstado("todas")}
              className="text-sm"
            >
              Todas ({cotizaciones.length})
            </Button>
            <Button
              variant={filtroEstado === "pendiente" ? "default" : "outline"}
              onClick={() => setFiltroEstado("pendiente")}
              className="text-sm"
            >
              Pendientes ({cotizaciones.filter((c) => c.estado === "pendiente").length})
            </Button>
            <Button
              variant={filtroEstado === "confirmada" ? "default" : "outline"}
              onClick={() => setFiltroEstado("confirmada")}
              className="text-sm"
            >
              Confirmadas ({cotizaciones.filter((c) => c.estado === "confirmada").length})
            </Button>
            <Button
              variant={filtroEstado === "completada" ? "default" : "outline"}
              onClick={() => setFiltroEstado("completada")}
              className="text-sm"
            >
              Completadas ({cotizaciones.filter((c) => c.estado === "completada").length})
            </Button>
          </div>
        </div>

        {cotizacionesFiltradas.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No hay cotizaciones {filtroEstado !== "todas" ? "en este estado" : ""}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted border-b border-border">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Cliente</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">RUT</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Correo</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Teléfono</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Total</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Estado</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Fecha</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cotizacionesFiltradas.map((cotizacion) => (
                  <tr key={cotizacion.id} className="border-b border-border hover:bg-muted/50">
                    <td className="px-4 py-3 text-sm font-medium text-foreground">#{cotizacion.id}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{cotizacion.cliente_nombre}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{getRut(cotizacion)}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground text-ellipsis">
                      {cotizacion.cliente_correo}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">{cotizacion.cliente_telefono || "N/A"}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-right text-foreground">
                      ${Number(cotizacion.precio_total).toLocaleString("es-CL")}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <select
                          value={cotizacion.estado}
                          onChange={(e) => handleCambiarEstado(cotizacion.id, e.target.value)}
                          className={`text-xs px-2 py-1 rounded capitalize ${getColorEstado(cotizacion.estado)}`}
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="confirmada">Confirmada</option>
                          <option value="completada">Completada</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {new Date(cotizacion.created_at).toLocaleDateString("es-CL")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 bg-transparent"
                          onClick={() => handleDescargarPDF(cotizacion)}
                          title="Descargar PDF"
                        >
                          <Download className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 bg-transparent"
                          onClick={() => handleEliminar(cotizacion.id)}
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
