"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, FileText } from "lucide-react"
import type { Tipo, Material, Cristal, Color } from "@/lib/database"
import { useToast } from "@/hooks/use-toast"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

interface VentanaItem {
  id: string
  tipoId: number
  materialId: number
  cristalId: number
  colorId: number
  cantidad: number
  ancho: string // Changed to string to allow empty values
  alto: string // Changed to string to allow empty values
}

interface Opcion {
  id: string
  nombre: string
  ventanas: VentanaItem[]
  total: number
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
    costoDespacho: "" as string | number,
    costoInstalacion: "" as string | number,
    gananciaGlobal: "" as string | number,
  })

  const [opciones, setOpciones] = useState<Opcion[]>([
    {
      id: "1",
      nombre: "Opción 1",
      ventanas: [
        {
          id: "1",
          tipoId: 0,
          materialId: 0,
          cristalId: 0,
          colorId: 0,
          cantidad: 1,
          ancho: "", // Empty string instead of 0
          alto: "", // Empty string instead of 0
        },
      ],
      total: 0,
    },
  ])

  const [notas, setNotas] = useState("")
  const [tipos, setTipos] = useState<Tipo[]>([])
  const [materiales, setMateriales] = useState<Material[]>([])
  const [cristales, setCristales] = useState<Cristal[]>([])
  const [colores, setColores] = useState<Color[]>([])
  const { toast } = useToast()

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      const [tiposRes, materialesRes, cristalesRes, coloresRes] = await Promise.all([
        fetch("/api/tipos"),
        fetch("/api/materiales"),
        fetch("/api/cristales"),
        fetch("/api/colores"),
      ])

      const tiposData = await tiposRes.json()
      const materialesData = await materialesRes.json()
      const cristalesData = await cristalesRes.json()
      const coloresData = await coloresRes.json()

      setTipos(tiposData.data)
      setMateriales(materialesData.data)
      setCristales(cristalesData.data)
      setColores(coloresData.data)
    } catch (error) {
      toast({ title: "Error", description: "No se pudieron cargar los datos", variant: "destructive" })
    }
  }

  const calcularValorTotal = (ventana: VentanaItem) => {
    const tipo = tipos.find((t) => t.id === ventana.tipoId)
    const cristal = cristales.find((c) => c.id === ventana.cristalId)
    const color = colores.find((co) => co.id === ventana.colorId)

    if (!tipo || !cristal || !color) return 0

    const anchoNum = Number.parseFloat(ventana.ancho) || 0
    const altoNum = Number.parseFloat(ventana.alto) || 0
    const metrosCuadrados = (anchoNum / 1000) * (altoNum / 1000)
    const precioBase = tipo.precio_por_m2 * metrosCuadrados
    const precioCristal = cristal.precio * metrosCuadrados
    const precioColor = color.precio * metrosCuadrados

    return (precioBase + precioCristal + precioColor) * ventana.cantidad
  }

  const actualizarVentana = (opcionId: string, ventanaId: string, campo: string, valor: any) => {
    setOpciones(
      opciones.map((opcion) =>
        opcion.id === opcionId
          ? {
              ...opcion,
              ventanas: opcion.ventanas.map((v) => (v.id === ventanaId ? { ...v, [campo]: valor } : v)),
            }
          : opcion,
      ),
    )
  }

  const agregarVentana = (opcionId: string) => {
    setOpciones(
      opciones.map((opcion) =>
        opcion.id === opcionId
          ? {
              ...opcion,
              ventanas: [
                ...opcion.ventanas,
                {
                  id: Date.now().toString(),
                  tipoId: 0,
                  materialId: 0,
                  cristalId: 0,
                  colorId: 0,
                  cantidad: 1,
                  ancho: "", // Empty string instead of 0
                  alto: "", // Empty string instead of 0
                },
              ],
            }
          : opcion,
      ),
    )
  }

  const eliminarVentana = (opcionId: string, ventanaId: string) => {
    setOpciones(
      opciones.map((opcion) =>
        opcion.id === opcionId
          ? {
              ...opcion,
              ventanas: opcion.ventanas.filter((v) => v.id !== ventanaId),
            }
          : opcion,
      ),
    )
  }

  const agregarOpcion = () => {
    const newId = (opciones.length + 1).toString()
    setOpciones([
      ...opciones,
      {
        id: newId,
        nombre: `Opción ${newId}`,
        ventanas: [
          {
            id: Date.now().toString(),
            tipoId: 0,
            materialId: 0,
            cristalId: 0,
            colorId: 0,
            cantidad: 1,
            ancho: "",
            alto: "",
          },
        ],
        total: 0,
      },
    ])
  }

  const eliminarOpcion = (opcionId: string) => {
    setOpciones(opciones.filter((o) => o.id !== opcionId))
  }

  const generarPDF = async () => {
    const doc = new jsPDF()

    doc.setFontSize(18)
    doc.text("Cotización", 14, 22)

    doc.setFontSize(11)
    doc.text(`Cliente: ${clientData.nombre}`, 14, 35)
    doc.text(`RUT: ${clientData.rut}`, 14, 42)
    doc.text(`Email: ${clientData.email}`, 14, 49)
    doc.text(`Teléfono: ${clientData.telefono}`, 14, 56)

    let yPosition = 70

    opciones.forEach((opcion) => {
      doc.setFontSize(14)
      doc.text(opcion.nombre, 14, yPosition)
      yPosition += 10

      const tableData = opcion.ventanas.map((v) => {
        const tipo = tipos.find((t) => t.id === v.tipoId)
        const material = materiales.find((m) => m.id === v.materialId)
        const cristal = cristales.find((c) => c.id === v.cristalId)
        const color = colores.find((co) => co.id === v.colorId)
        return [
          material?.nombre || "-",
          tipo?.descripcion || "-",
          cristal?.descripcion || "-",
          color?.nombre || "-",
          v.cantidad,
          v.ancho,
          v.alto,
          `$${calcularValorTotal(v).toLocaleString("es-CL")}`,
        ]
      })

      autoTable(doc, {
        startY: yPosition,
        head: [["Material", "Tipo", "Cristal", "Color", "Cant.", "Ancho", "Alto", "Total"]],
        body: tableData,
      })

      yPosition = (doc as any).lastAutoTable.finalY + 10
    })

    try {
      const pdfBlob = doc.output("blob")
      const fileName = `cotizacion-${clientData.nombre.replace(/\s+/g, "-")}-${Date.now()}.pdf`

      const formData = new FormData()
      formData.append("file", pdfBlob, fileName)

      const uploadResponse = await fetch("/api/save-pdf", {
        method: "POST",
        body: formData,
      })

      const uploadResult = await uploadResponse.json()

      if (uploadResult.success) {
        const precioTotal = opciones.reduce((total, opcion) => {
          return (
            total +
            opcion.ventanas.reduce((sum, v) => {
              return sum + calcularValorTotal(v)
            }, 0)
          )
        }, 0)

        const saveResponse = await fetch("/api/cotizaciones", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clienteNombre: clientData.nombre,
            clienteRut: clientData.rut,
            clienteCorreo: clientData.email,
            clienteTelefono: clientData.telefono,
            clienteDireccion: "",
            precioTotal: precioTotal,
            pdfUrl: uploadResult.url,
            items: opciones.flatMap((opcion) =>
              opcion.ventanas.map((v) => ({
                tipoId: v.tipoId,
                materialId: v.materialId,
                cristalId: v.cristalId,
                colorId: v.colorId,
                cantidad: v.cantidad,
                ancho: v.ancho,
                alto: v.alto,
              })),
            ),
          }),
        })

        const saveResult = await saveResponse.json()

        if (saveResult.success) {
          alert("Cotización guardada en el historial correctamente")
        }
      }
    } catch (error) {
      console.error("Error saving to history:", error)
    }

    doc.save("cotizacion.pdf")
  }

  const handleEnviarCotizacion = async () => {
    if (!clientData.email || !clientData.nombre) {
      toast({ title: "Error", description: "Complete los datos del cliente", variant: "destructive" })
      return
    }

    const costoDespacho = Number(datosAdicionales.costoDespacho) || 0
    const costoInstalacion = Number(datosAdicionales.costoInstalacion) || 0
    const gananciaGlobal = Number(datosAdicionales.gananciaGlobal) || 0

    try {
      const response = await fetch("/api/enviar-cotizacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientData,
          opciones: opciones.map((opcion) => ({
            ...opcion,
            ventanas: opcion.ventanas.map((v) => ({
              ...v,
              tipo: tipos.find((t) => t.id === v.tipoId),
              material: materiales.find((m) => m.id === v.materialId),
              cristal: cristales.find((c) => c.id === v.cristalId),
              color: colores.find((co) => co.id === v.colorId),
              valorTotal: calcularValorTotal(v),
            })),
          })),
          datosAdicionales: {
            costoDespacho,
            costoInstalacion,
            gananciaGlobal,
          },
          notas,
        }),
      })

      if (response.ok) {
        toast({ title: "Éxito", description: "Cotización enviada por correo" })
      } else {
        toast({ title: "Error", description: "Error al enviar cotización", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error", description: "Error de conexión", variant: "destructive" })
    }
  }

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
                min="0"
                value={datosAdicionales.costoDespacho}
                onChange={(e) =>
                  setDatosAdicionales({
                    ...datosAdicionales,
                    costoDespacho: e.target.value === "" ? "" : Number.parseFloat(e.target.value),
                  })
                }
                placeholder="0"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Costo de Instalación</label>
              <Input
                type="number"
                min="0"
                value={datosAdicionales.costoInstalacion}
                onChange={(e) =>
                  setDatosAdicionales({
                    ...datosAdicionales,
                    costoInstalacion: e.target.value === "" ? "" : Number.parseFloat(e.target.value),
                  })
                }
                placeholder="0"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Ganancia Global (%)</label>
              <Input
                type="number"
                min="0"
                max="100"
                value={datosAdicionales.gananciaGlobal}
                onChange={(e) =>
                  setDatosAdicionales({
                    ...datosAdicionales,
                    gananciaGlobal: e.target.value === "" ? "" : Number.parseFloat(e.target.value),
                  })
                }
                placeholder="0"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {opciones.map((opcion) => {
        const totalOpcion = opcion.ventanas.reduce((sum, v) => sum + calcularValorTotal(v), 0)
        return (
          <Card key={opcion.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{opcion.nombre}</CardTitle>
              <div className="flex gap-2">
                <Button
                  onClick={() => agregarVentana(opcion.id)}
                  size="sm"
                  className="gap-1 bg-teal-600 hover:bg-teal-700"
                >
                  <Plus className="h-4 w-4" />
                  Agregar Ventana
                </Button>
                {opciones.length > 1 && (
                  <Button onClick={() => eliminarOpcion(opcion.id)} size="sm" variant="destructive" className="gap-1">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto border border-border rounded">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="text-left py-3 px-2">N°</th>
                      <th className="text-left py-3 px-2 w-32">Material</th>
                      <th className="text-left py-3 px-2">Tipo</th>
                      <th className="text-left py-3 px-2">Cristal</th>
                      <th className="text-left py-3 px-2">Color</th>
                      <th className="text-center py-3 px-2">Cantidad</th>
                      <th className="text-center py-3 px-2">Ancho</th>
                      <th className="text-center py-3 px-2">Alto</th>
                      <th className="text-right py-3 px-2">V. Unitario</th>
                      <th className="text-right py-3 px-2">V. Total</th>
                      <th className="w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {opcion.ventanas.map((ventana, idx) => (
                      <tr key={ventana.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-2">{idx + 1}</td>
                        <td className="py-2 px-2">
                          <div className="relative group">
                            <Select
                              value={String(ventana.materialId)}
                              onValueChange={(v) =>
                                actualizarVentana(opcion.id, ventana.id, "materialId", Number.parseInt(v))
                              }
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
                            {ventana.materialId > 0 && (
                              <div className="absolute left-0 top-full mt-1 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-50 hidden group-hover:block">
                                {materiales.find((m) => m.id === ventana.materialId)?.nombre}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-2 px-2">
                          <Select
                            value={String(ventana.tipoId)}
                            onValueChange={(v) =>
                              actualizarVentana(opcion.id, ventana.id, "tipoId", Number.parseInt(v))
                            }
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
                            onValueChange={(v) =>
                              actualizarVentana(opcion.id, ventana.id, "cristalId", Number.parseInt(v))
                            }
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
                            onValueChange={(v) =>
                              actualizarVentana(opcion.id, ventana.id, "colorId", Number.parseInt(v))
                            }
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
                              actualizarVentana(opcion.id, ventana.id, "cantidad", Number.parseInt(e.target.value) || 1)
                            }
                            className="w-full h-8 text-center"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <Input
                            type="number"
                            step="0.1"
                            min="0"
                            placeholder="0" // Added placeholder
                            value={ventana.ancho}
                            onChange={
                              (e) => actualizarVentana(opcion.id, ventana.id, "ancho", e.target.value) // Store as string
                            }
                            className="w-full h-8 text-center"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <Input
                            type="number"
                            step="0.1"
                            min="0"
                            placeholder="0" // Added placeholder
                            value={ventana.alto}
                            onChange={
                              (e) => actualizarVentana(opcion.id, ventana.id, "alto", e.target.value) // Store as string
                            }
                            className="w-full h-8 text-center"
                          />
                        </td>
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
                            onClick={() => eliminarVentana(opcion.id, ventana.id)}
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

              <div className="mt-4 text-right text-lg font-semibold">Total: ${totalOpcion.toLocaleString("es-CL")}</div>
            </CardContent>
          </Card>
        )
      })}

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
        <Button onClick={agregarOpcion} variant="outline" className="gap-2 bg-transparent">
          <Plus className="h-4 w-4" />
          Agregar otra opción
        </Button>
        <Button onClick={generarPDF} className="gap-2 bg-teal-600 hover:bg-teal-700">
          <FileText className="h-4 w-4" />
          Generar PDF
        </Button>
        <Button onClick={handleEnviarCotizacion} className="gap-2 bg-blue-600 hover:bg-blue-700">
          Enviar por Email
        </Button>
      </div>
    </div>
  )
}
