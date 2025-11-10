"use client"

import Link from "next/link"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2 } from "lucide-react"
import { getTipos, getMateriales, getCristales, getColores } from "@/lib/database"

interface VentanaItem {
  id: string
  tipoId: number
  materialId: number
  cristalId: number
  colorId: number
  cantidad: number
  ancho: number
  alto: number
}

export default function CotizarPage() {
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
      tipoId: 0,
      materialId: 0,
      cristalId: 0,
      colorId: 0,
      cantidad: 1,
      ancho: 0,
      alto: 0,
    },
  ])

  const [notas, setNotas] = useState("")

  const tipos = getTipos()
  const materiales = getMateriales()
  const cristales = getCristales()
  const colores = getColores()

  const calcularValorTotal = (ventana: VentanaItem) => {
    if (!ventana.tipoId || ventana.ancho === 0 || ventana.alto === 0) return 0
    const tipo = tipos.find((t) => t.id === ventana.tipoId)
    const cristal = cristales.find((c) => c.id === ventana.cristalId)
    if (!tipo || !cristal) return 0
    const area = ventana.ancho * ventana.alto
    const precioBase = (tipo.ganancia * area) / 100
    const precioCristal = cristal.precio * area
    return (precioBase + precioCristal) * ventana.cantidad
  }

  const agregarVentana = () => {
    const newId = (Math.max(...ventanas.map((v) => Number.parseInt(v.id)), 0) + 1).toString()
    setVentanas([
      ...ventanas,
      {
        id: newId,
        tipoId: 0,
        materialId: 0,
        cristalId: 0,
        colorId: 0,
        cantidad: 1,
        ancho: 0,
        alto: 0,
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
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link href="/admin" className="hover:text-foreground">
          Home
        </Link>
        <span>›</span>
        <span>Cotizar</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Datos Cliente</CardTitle>
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
              placeholder="Correo electrónico"
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

        <Card>
          <CardHeader>
            <CardTitle>Datos Adicionales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">Costo de Despacho</label>
              <Input
                type="number"
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

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Opción 1</CardTitle>
          <Button onClick={agregarVentana} size="sm" className="gap-1 bg-teal-600 hover:bg-teal-700">
            <Plus className="h-4 w-4" />
            Agregar Ventana
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto border border-border rounded">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="text-left py-3 px-2">N°</th>
                  <th className="text-left py-3 px-2">Material</th>
                  <th className="text-left py-3 px-2">Tipo</th>
                  <th className="text-left py-3 px-2">Cristal</th>
                  <th className="text-left py-3 px-2">Color</th>
                  <th className="text-center py-3 px-2">Cantidad</th>
                  <th className="text-center py-3 px-2">Ancho</th>
                  <th className="text-center py-3 px-2">Alto</th>
                  <th className="text-right py-3 px-2">Ganancia</th>
                  <th className="text-right py-3 px-2">V. Unitario</th>
                  <th className="text-right py-3 px-2">V. Total</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {ventanas.map((ventana, idx) => (
                  <tr key={ventana.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-2">{idx + 1}</td>
                    <td className="py-2 px-2">
                      <Select
                        value={String(ventana.materialId)}
                        onValueChange={(v) => actualizarVentana(ventana.id, "materialId", Number.parseInt(v))}
                      >
                        <SelectTrigger className="w-full h-8">
                          <SelectValue placeholder="Sel." />
                        </SelectTrigger>
                        <SelectContent>
                          {materiales.map((m) => (
                            <SelectItem key={m.id} value={String(m.id)}>
                              {m.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-2 px-2">
                      <Select
                        value={String(ventana.tipoId)}
                        onValueChange={(v) => actualizarVentana(ventana.id, "tipoId", Number.parseInt(v))}
                      >
                        <SelectTrigger className="w-full h-8">
                          <SelectValue placeholder="Sel." />
                        </SelectTrigger>
                        <SelectContent>
                          {tipos.map((t) => (
                            <SelectItem key={t.id} value={String(t.id)}>
                              {t.descripcion}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-2 px-2">
                      <Select
                        value={String(ventana.cristalId)}
                        onValueChange={(v) => actualizarVentana(ventana.id, "cristalId", Number.parseInt(v))}
                      >
                        <SelectTrigger className="w-full h-8">
                          <SelectValue placeholder="Sel." />
                        </SelectTrigger>
                        <SelectContent>
                          {cristales.map((c) => (
                            <SelectItem key={c.id} value={String(c.id)}>
                              {c.descripcion}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-2 px-2">
                      <Select
                        value={String(ventana.colorId)}
                        onValueChange={(v) => actualizarVentana(ventana.id, "colorId", Number.parseInt(v))}
                      >
                        <SelectTrigger className="w-full h-8">
                          <SelectValue placeholder="Sel." />
                        </SelectTrigger>
                        <SelectContent>
                          {colores.map((co) => (
                            <SelectItem key={co.id} value={String(co.id)}>
                              {co.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-2 px-2">
                      <Input
                        type="number"
                        min="1"
                        value={ventana.cantidad}
                        onChange={(e) =>
                          actualizarVentana(ventana.id, "cantidad", Number.parseInt(e.target.value) || 1)
                        }
                        className="w-full h-8 text-center"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <Input
                        type="number"
                        step="0.1"
                        value={ventana.ancho}
                        onChange={(e) => actualizarVentana(ventana.id, "ancho", Number.parseFloat(e.target.value) || 0)}
                        className="w-full h-8 text-center"
                      />
                    </td>
                    <td className="py-2 px-2">
                      <Input
                        type="number"
                        step="0.1"
                        value={ventana.alto}
                        onChange={(e) => actualizarVentana(ventana.id, "alto", Number.parseFloat(e.target.value) || 0)}
                        className="w-full h-8 text-center"
                      />
                    </td>
                    <td className="py-2 px-2 text-right">0</td>
                    <td className="py-2 px-2 text-right text-sm">
                      ${(calcularValorTotal(ventana) / ventana.cantidad).toLocaleString("es-CL")}
                    </td>
                    <td className="py-2 px-2 text-right font-semibold text-sm">
                      ${calcularValorTotal(ventana).toLocaleString("es-CL")}
                    </td>
                    <td className="py-2 px-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => eliminarVentana(ventana.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-right text-lg font-semibold">Total: ${totalGeneral.toLocaleString("es-CL")}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notas adicionales</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Ingresa texto de pie de página"
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            className="min-h-20"
          />
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" className="gap-2 bg-transparent">
          <Plus className="h-4 w-4" />
          Agregar otra opción
        </Button>
        <Button className="gap-2 flex-1 bg-orange-500 hover:bg-orange-600">Crear cotización</Button>
      </div>
    </div>
  )
}
