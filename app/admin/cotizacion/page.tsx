"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, Download } from "lucide-react"
import { TIPOS_VENTANAS, MATERIALES_MARCO, TIPOS_VIDRIO } from "@/lib/productos-database"

interface VentanaItem {
  id: string
  material: string
  tipo: string
  cristal: string
  color: string
  cantidad: number
  ancho: number
  alto: number
  ganancia: number
}

export default function CotizacionPage() {
  const [clientData, setClientData] = useState({
    nombre: "",
    rut: "",
    email: "",
    telefono: "",
    direccion: "",
  })

  const [datosAdicionales, setDatosAdicionales] = useState({
    costoDespacho: 0,
    costoInstalacion: 0,
    gananciaGlobal: 0,
  })

  const [ventanas, setVentanas] = useState<VentanaItem[]>([
    {
      id: "1",
      material: "",
      tipo: "",
      cristal: "",
      color: "",
      cantidad: 1,
      ancho: 0,
      alto: 0,
      ganancia: 0,
    },
  ])

  const [notas, setNotas] = useState("")

  const calcularArea = (ancho: number, alto: number) => ancho * alto
  const calcularValorTotal = (ventana: VentanaItem) => {
    if (!ventana.tipo || ventana.ancho === 0 || ventana.alto === 0) return 0
    const producto = TIPOS_VENTANAS.find((p) => p.id === ventana.tipo)
    if (!producto) return 0
    const area = calcularArea(ventana.ancho, ventana.alto)
    const precioBase = producto.precioBaseM2 * area
    const perjuicio = (precioBase * ventana.ganancia) / 100
    return (precioBase + perjuicio) * ventana.cantidad
  }

  const agregarVentana = () => {
    const newId = (Math.max(...ventanas.map((v) => Number.parseInt(v.id)), 0) + 1).toString()
    setVentanas([
      ...ventanas,
      {
        id: newId,
        material: "",
        tipo: "",
        cristal: "",
        color: "",
        cantidad: 1,
        ancho: 0,
        alto: 0,
        ganancia: 0,
      },
    ])
  }

  const eliminarVentana = (id: string) => {
    if (ventanas.length > 1) {
      setVentanas(ventanas.filter((v) => v.id !== id))
    }
  }

  const actualizarVentana = (id: string, campo: string, valor: any) => {
    setVentanas(ventanas.map((v) => (v.id === id ? { ...v, [campo]: valor } : v)))
  }

  const totalGeneral = ventanas.reduce((sum, v) => sum + calcularValorTotal(v), 0)
  const totalFinal = totalGeneral + datosAdicionales.costoDespacho + datosAdicionales.costoInstalacion

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Crear Cotización</h1>
        <p className="text-muted-foreground">Nueva cotización de termopaneles</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Datos Cliente */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Datos Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Nombre del cliente"
              value={clientData.nombre}
              onChange={(e) => setClientData({ ...clientData, nombre: e.target.value })}
            />
            <Input
              placeholder="RUT (Ej: 12345678-9)"
              value={clientData.rut}
              onChange={(e) => setClientData({ ...clientData, rut: e.target.value })}
            />
            <Input
              placeholder="Email"
              type="email"
              value={clientData.email}
              onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
            />
            <Input
              placeholder="Teléfono"
              value={clientData.telefono}
              onChange={(e) => setClientData({ ...clientData, telefono: e.target.value })}
            />
            <Input
              placeholder="Dirección"
              value={clientData.direccion}
              onChange={(e) => setClientData({ ...clientData, direccion: e.target.value })}
            />
          </CardContent>
        </Card>

        {/* Datos Adicionales */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Datos Adicionales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">Costo de Despacho</label>
              <Input
                type="number"
                placeholder="0"
                value={datosAdicionales.costoDespacho}
                onChange={(e) =>
                  setDatosAdicionales({
                    ...datosAdicionales,
                    costoDespacho: Number.parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Costo de Instalación</label>
              <Input
                type="number"
                placeholder="0"
                value={datosAdicionales.costoInstalacion}
                onChange={(e) =>
                  setDatosAdicionales({
                    ...datosAdicionales,
                    costoInstalacion: Number.parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Ganancia Global (%)</label>
              <Input
                type="number"
                placeholder="0"
                value={datosAdicionales.gananciaGlobal}
                onChange={(e) =>
                  setDatosAdicionales({
                    ...datosAdicionales,
                    gananciaGlobal: Number.parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de Ventanas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Opción 1</CardTitle>
          <Button onClick={agregarVentana} size="sm" className="gap-1">
            <Plus className="h-4 w-4" />
            Agregar Ventana
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2">N°</th>
                  <th className="text-left py-3 px-2">Material</th>
                  <th className="text-left py-3 px-2">Tipo</th>
                  <th className="text-left py-3 px-2">Cristal</th>
                  <th className="text-left py-3 px-2">Color</th>
                  <th className="text-center py-3 px-2">Cantidad</th>
                  <th className="text-center py-3 px-2">Ancho</th>
                  <th className="text-center py-3 px-2">Alto</th>
                  <th className="text-center py-3 px-2">Ganancia %</th>
                  <th className="text-right py-3 px-2">V. Unitario</th>
                  <th className="text-right py-3 px-2">V. Total</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {ventanas.map((ventana, idx) => (
                  <tr key={ventana.id} className="border-b border-border hover:bg-secondary/50">
                    <td className="py-3 px-2">{idx + 1}</td>
                    <td className="py-3 px-2">
                      <Select
                        value={ventana.material}
                        onValueChange={(v) => actualizarVentana(ventana.id, "material", v)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Sel." />
                        </SelectTrigger>
                        <SelectContent>
                          {MATERIALES_MARCO.map((m) => (
                            <SelectItem key={m.id} value={m.id}>
                              {m.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-3 px-2">
                      <Select value={ventana.tipo} onValueChange={(v) => actualizarVentana(ventana.id, "tipo", v)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Sel." />
                        </SelectTrigger>
                        <SelectContent>
                          {TIPOS_VENTANAS.map((t) => (
                            <SelectItem key={t.id} value={t.id}>
                              {t.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-3 px-2">
                      <Select
                        value={ventana.cristal}
                        onValueChange={(v) => actualizarVentana(ventana.id, "cristal", v)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Sel." />
                        </SelectTrigger>
                        <SelectContent>
                          {TIPOS_VIDRIO.map((v) => (
                            <SelectItem key={v.id} value={v.id}>
                              {v.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-3 px-2">
                      <Input
                        placeholder="Color"
                        value={ventana.color}
                        onChange={(e) => actualizarVentana(ventana.id, "color", e.target.value)}
                        className="w-full"
                      />
                    </td>
                    <td className="py-3 px-2">
                      <Input
                        type="number"
                        min="1"
                        value={ventana.cantidad}
                        onChange={(e) =>
                          actualizarVentana(ventana.id, "cantidad", Number.parseInt(e.target.value) || 1)
                        }
                        className="w-full text-center"
                      />
                    </td>
                    <td className="py-3 px-2">
                      <Input
                        type="number"
                        step="0.1"
                        value={ventana.ancho}
                        onChange={(e) => actualizarVentana(ventana.id, "ancho", Number.parseFloat(e.target.value) || 0)}
                        className="w-full text-center"
                        placeholder="0"
                      />
                    </td>
                    <td className="py-3 px-2">
                      <Input
                        type="number"
                        step="0.1"
                        value={ventana.alto}
                        onChange={(e) => actualizarVentana(ventana.id, "alto", Number.parseFloat(e.target.value) || 0)}
                        className="w-full text-center"
                        placeholder="0"
                      />
                    </td>
                    <td className="py-3 px-2">
                      <Input
                        type="number"
                        value={ventana.ganancia}
                        onChange={(e) =>
                          actualizarVentana(ventana.id, "ganancia", Number.parseFloat(e.target.value) || 0)
                        }
                        className="w-full text-center"
                        placeholder="0"
                      />
                    </td>
                    <td className="py-3 px-2 text-right">
                      ${(calcularValorTotal(ventana) / ventana.cantidad).toLocaleString("es-CL")}
                    </td>
                    <td className="py-3 px-2 text-right font-semibold">
                      ${calcularValorTotal(ventana).toLocaleString("es-CL")}
                    </td>
                    <td className="py-3 px-2">
                      <button
                        onClick={() => eliminarVentana(ventana.id)}
                        className="text-destructive hover:bg-destructive/10 p-1 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-right text-lg font-semibold">Total: ${totalGeneral.toLocaleString("es-CL")}</div>
        </CardContent>
      </Card>

      {/* Notas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Notas adicionales</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Ingresa notas o comentarios adicionales..."
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            className="min-h-24"
          />
        </CardContent>
      </Card>

      {/* Resumen y Botones */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>${totalGeneral.toLocaleString("es-CL")}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Despacho:</span>
              <span>${datosAdicionales.costoDespacho.toLocaleString("es-CL")}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Instalación:</span>
              <span>${datosAdicionales.costoInstalacion.toLocaleString("es-CL")}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t border-primary/20 pt-2">
              <span>Total Final:</span>
              <span>${totalFinal.toLocaleString("es-CL")}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Plus className="h-4 w-4" />
              Agregar otra opción
            </Button>
            <Button className="gap-2 flex-1">
              <Download className="h-4 w-4" />
              Crear cotización
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
