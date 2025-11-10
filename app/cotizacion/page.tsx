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
import "jspdf-autotable"

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
    costoDespacho: 0,
    costoInstalacion: 0,
    gananciaGlobal: 0,
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
          ancho: 0,
          alto: 0,
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
    if (!ventana.tipoId || ventana.ancho === 0 || ventana.alto === 0) return 0
    const tipo = tipos.find((t) => t.id === ventana.tipoId)
    const cristal = cristales.find((c) => c.id === ventana.cristalId)
    if (!tipo || !cristal) return 0
    const area = (ventana.ancho * ventana.alto) / 10000
    const precioBase = (tipo.ganancia * area) / 100
    const precioCristal = cristal.precio * area
    return Math.round((precioBase + precioCristal) * ventana.cantidad)
  }

  const agregarVentana = (opcionId: string) => {
    setOpciones(
      opciones.map((op) => {
        if (op.id === opcionId) {
          const ultimaVentana = op.ventanas[op.ventanas.length - 1]
          const newId = (Math.max(...op.ventanas.map((v) => Number.parseInt(v.id)), 0) + 1).toString()
          return {
            ...op,
            ventanas: [
              ...op.ventanas,
              {
                id: newId,
                tipoId: ultimaVentana.tipoId,
                materialId: ultimaVentana.materialId,
                cristalId: ultimaVentana.cristalId,
                colorId: ultimaVentana.colorId,
                cantidad: ultimaVentana.cantidad,
                ancho: ultimaVentana.ancho,
                alto: ultimaVentana.alto,
              },
            ],
          }
        }
        return op
      }),
    )
  }

  const eliminarVentana = (opcionId: string, ventanaId: string) => {
    setOpciones(
      opciones.map((op) => {
        if (op.id === opcionId) {
          return {
            ...op,
            ventanas: op.ventanas.filter((v) => v.id !== ventanaId || op.ventanas.length > 1),
          }
        }
        return op
      }),
    )
  }

  const actualizarVentana = (opcionId: string, ventanaId: string, campo: string, valor: any) => {
    setOpciones(
      opciones.map((op) => {
        if (op.id === opcionId) {
          return {
            ...op,
            ventanas: op.ventanas.map((v) => (v.id === ventanaId ? { ...v, [campo]: valor } : v)),
          }
        }
        return op
      }),
    )
  }

  const agregarOpcion = () => {
    const primeraOpcion = opciones[0]
    const newId = (Math.max(...opciones.map((o) => Number.parseInt(o.id)), 0) + 1).toString()

    // Copiar ventanas de la primera opción con IDs nuevos
    const ventanasCopiadas = primeraOpcion.ventanas.map((ventana, idx) => ({
      id: (idx + 1).toString(),
      tipoId: ventana.tipoId,
      materialId: 0, // Dejar material vacío para que lo cambie el usuario
      cristalId: ventana.cristalId,
      colorId: ventana.colorId,
      cantidad: ventana.cantidad,
      ancho: ventana.ancho,
      alto: ventana.alto,
    }))

    setOpciones([
      ...opciones,
      {
        id: newId,
        nombre: `Opción ${Number.parseInt(newId)}`,
        ventanas: ventanasCopiadas,
        total: 0,
      },
    ])
    toast({ title: "Éxito", description: "Nueva opción agregada con estructura replicada" })
  }

  const eliminarOpcion = (id: string) => {
    if (opciones.length > 1) {
      setOpciones(opciones.filter((op) => op.id !== id))
      toast({ title: "Éxito", description: "Opción eliminada" })
    }
  }

  const generarPDF = () => {
    if (!clientData.nombre || opciones.some((op) => op.ventanas.length === 0)) {
      toast({ title: "Error", description: "Completa los datos del cliente y ventanas", variant: "destructive" })
      return
    }

    try {
      const pdf = new jsPDF()
      let yPosition = 20

      // Header
      pdf.setFontSize(24)
      pdf.setTextColor(26, 122, 111) // Teal color
      pdf.text("TermoAcusticos", 20, yPosition)
      yPosition += 10

      pdf.setFontSize(10)
      pdf.setTextColor(100, 100, 100)
      pdf.text("Cotización de Termopaneles y Acústica", 20, yPosition)
      yPosition += 15

      // Client data
      pdf.setFontSize(12)
      pdf.setTextColor(0, 0, 0)
      pdf.text("Datos del Cliente", 20, yPosition)
      yPosition += 8

      pdf.setFontSize(10)
      pdf.text(`Nombre: ${clientData.nombre}`, 20, yPosition)
      yPosition += 5
      pdf.text(`RUT: ${clientData.rut}`, 20, yPosition)
      yPosition += 5
      pdf.text(`Email: ${clientData.email}`, 20, yPosition)
      yPosition += 5
      pdf.text(`Teléfono: ${clientData.telefono}`, 20, yPosition)
      yPosition += 5
      pdf.text(`Dirección: ${clientData.direccion}`, 20, yPosition)
      yPosition += 15

      // Process each option
      opciones.forEach((opcion, opcionIdx) => {
        // Check if we need a new page
        if (yPosition > 250) {
          pdf.addPage()
          yPosition = 20
        }

        pdf.setFontSize(12)
        pdf.setTextColor(26, 122, 111)
        pdf.text(opcion.nombre, 20, yPosition)
        yPosition += 10

        // Calculate totals for this option
        let subtotal = 0
        opcion.ventanas.forEach((ventana) => {
          subtotal += calcularValorTotal(ventana)
        })

        // Table with windows
        const tableData = opcion.ventanas.map((ventana, idx) => {
          const tipo = tipos.find((t) => t.id === ventana.tipoId)
          const material = materiales.find((m) => m.id === ventana.materialId)
          const cristal = cristales.find((c) => c.id === ventana.cristalId)
          const color = colores.find((c) => c.id === ventana.colorId)
          const valor = calcularValorTotal(ventana)

          return [
            String(idx + 1),
            tipo?.descripcion || "-",
            material?.nombre || "-",
            cristal?.descripcion || "-",
            color?.nombre || "-",
            String(ventana.cantidad),
            `${ventana.ancho}x${ventana.alto}`,
            `$${(valor / ventana.cantidad).toLocaleString("es-CL")}`,
            `$${valor.toLocaleString("es-CL")}`,
          ]
        })

        pdf.autoTable({
          head: [["N°", "Tipo", "Material", "Cristal", "Color", "Cant.", "Medidas", "V. Unit.", "V. Total"]],
          body: tableData,
          startY: yPosition,
          margin: 20,
          theme: "grid",
          headStyles: { fillColor: [26, 122, 111], textColor: [255, 255, 255] },
          bodyStyles: { textColor: [0, 0, 0] },
          alternateRowStyles: { fillColor: [240, 240, 240] },
        })

        yPosition = (pdf as any).lastAutoTable.finalY + 10

        // Subtotal for this option
        const totalConGanancia = Math.round(subtotal * (1 + datosAdicionales.gananciaGlobal / 100))
        const totalFinal = totalConGanancia + datosAdicionales.costoDespacho + datosAdicionales.costoInstalacion

        pdf.setFontSize(10)
        pdf.setTextColor(0, 0, 0)
        pdf.text(`Subtotal ${opcion.nombre}: $${subtotal.toLocaleString("es-CL")}`, 20, yPosition)
        yPosition += 6
        if (datosAdicionales.gananciaGlobal > 0) {
          pdf.text(
            `Con ganancia (${datosAdicionales.gananciaGlobal}%): $${totalConGanancia.toLocaleString("es-CL")}`,
            20,
            yPosition,
          )
          yPosition += 6
        }
        if (datosAdicionales.costoDespacho > 0) {
          pdf.text(`Costo despacho: $${datosAdicionales.costoDespacho.toLocaleString("es-CL")}`, 20, yPosition)
          yPosition += 6
        }
        if (datosAdicionales.costoInstalacion > 0) {
          pdf.text(`Costo instalación: $${datosAdicionales.costoInstalacion.toLocaleString("es-CL")}`, 20, yPosition)
          yPosition += 6
        }

        pdf.setFontSize(12)
        pdf.setTextColor(26, 122, 111)
        pdf.text(`Total ${opcion.nombre}: $${totalFinal.toLocaleString("es-CL")}`, 20, yPosition)
        yPosition += 15
      })

      // Notes
      if (notas) {
        if (yPosition > 250) {
          pdf.addPage()
          yPosition = 20
        }
        pdf.setFontSize(10)
        pdf.setTextColor(0, 0, 0)
        pdf.text("Notas:", 20, yPosition)
        yPosition += 5
        const notesLines = pdf.splitTextToSize(notas, 170)
        pdf.text(notesLines, 20, yPosition)
      }

      const pdfBlob = pdf.output("blob")
      const pdfUrl = URL.createObjectURL(pdfBlob)
      window.open(pdfUrl, "_blank")

      toast({ title: "Éxito", description: "Cotización generada en nueva ventana" })
    } catch (error) {
      console.error(error)
      toast({ title: "Error", description: "Error al generar el PDF", variant: "destructive" })
    }
  }

  const truncarMaterial = (nombre: string, maxLength = 25) => {
    if (nombre.length > maxLength) {
      return nombre.substring(0, maxLength) + "..."
    }
    return nombre
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
                            value={ventana.ancho}
                            onChange={(e) =>
                              actualizarVentana(opcion.id, ventana.id, "ancho", Number.parseFloat(e.target.value) || 0)
                            }
                            className="w-full h-8 text-center"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <Input
                            type="number"
                            step="0.1"
                            value={ventana.alto}
                            onChange={(e) =>
                              actualizarVentana(opcion.id, ventana.id, "alto", Number.parseFloat(e.target.value) || 0)
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
        <Button onClick={generarPDF} className="gap-2 flex-1 bg-orange-500 hover:bg-orange-600">
          <FileText className="h-4 w-4" />
          Generar Cotización
        </Button>
      </div>
    </div>
  )
}
