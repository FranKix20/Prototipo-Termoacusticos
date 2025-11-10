"use client"

import { useState } from "react"
import { getCotizaciones, actualizarCotizacion, type Cotizacion } from "@/lib/database"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Eye, Download, Trash2 } from "lucide-react"

export function HistorialCotizaciones() {
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>(getCotizaciones())
  const [filtroEstado, setFiltroEstado] = useState<"todas" | "pendiente" | "confirmada" | "completada">("todas")

  const cotizacionesFiltradas =
    filtroEstado === "todas" ? cotizaciones : cotizaciones.filter((c) => c.estado === filtroEstado)

  const handleCambiarEstado = (id: number, nuevoEstado: Cotizacion["estado"]) => {
    actualizarCotizacion(id, { estado: nuevoEstado })
    setCotizaciones(getCotizaciones())
  }

  const handleDescargarPDF = (cotizacion: Cotizacion) => {
    // Generar PDF con los datos de la cotización
    const contenido = `
COTIZACIÓN #${cotizacion.id}
Fecha: ${new Date(cotizacion.fechaCreacion).toLocaleDateString()}

DATOS DEL CLIENTE
Nombre: ${cotizacion.clienteNombre}
Correo: ${cotizacion.clienteCorreo}
Teléfono: ${cotizacion.clienteTelefono}
Dirección: ${cotizacion.clienteDireccion}

RESUMEN DE COTIZACIÓN
Total: $${cotizacion.precioTotal.toLocaleString()}
Costo de Despacho: $${cotizacion.costoDespacho.toLocaleString()}
Costo de Instalación: $${cotizacion.costoInstalacion.toLocaleString()}
Ganancia Global: ${cotizacion.gananciaGlobal}%

Notas: ${cotizacion.notas || "Sin notas"}
    `

    const element = document.createElement("a")
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(contenido))
    element.setAttribute("download", `cotizacion-${cotizacion.id}.txt`)
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
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
                    <td className="px-4 py-3 text-sm text-foreground">{cotizacion.clienteNombre}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground text-ellipsis">
                      {cotizacion.clienteCorreo}
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">{cotizacion.clienteTelefono}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-right text-foreground">
                      ${cotizacion.precioTotal.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <select
                          value={cotizacion.estado}
                          onChange={(e) => handleCambiarEstado(cotizacion.id, e.target.value as Cotizacion["estado"])}
                          className={`text-xs px-2 py-1 rounded capitalize ${getColorEstado(cotizacion.estado)}`}
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="confirmada">Confirmada</option>
                          <option value="completada">Completada</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {new Date(cotizacion.fechaCreacion).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0 bg-transparent">
                          <Eye className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 bg-transparent"
                          onClick={() => handleDescargarPDF(cotizacion)}
                        >
                          <Download className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0 bg-transparent">
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
