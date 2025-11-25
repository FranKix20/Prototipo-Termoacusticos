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
    empresa: "", // Added empresa field
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

  const [showMaterialModal, setShowMaterialModal] = useState(false)
  const [currentOpcionForModal, setCurrentOpcionForModal] = useState<Opcion | null>(null)
  const [selectedMaterialForOption, setSelectedMaterialForOption] = useState(0)

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

  const calcularQuincalleria = (ventana: VentanaItem) => {
    // Base hardware cost of 15000 per window
    const costoBase = 15000
    return costoBase * ventana.cantidad
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
    const costoQuincalleria = calcularQuincalleria(ventana)

    return (precioBase + precioCristal + precioColor) * ventana.cantidad + costoQuincalleria
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
      opciones.map((opcion) => {
        if (opcion.id === opcionId && opcion.ventanas.length > 0) {
          const lastVentana = opcion.ventanas[opcion.ventanas.length - 1]
          return {
            ...opcion,
            ventanas: [
              ...opcion.ventanas,
              {
                id: Date.now().toString(),
                tipoId: 0,
                materialId: lastVentana.materialId,
                cristalId: lastVentana.cristalId,
                colorId: lastVentana.colorId,
                cantidad: lastVentana.cantidad,
                ancho: lastVentana.ancho,
                alto: lastVentana.alto,
              },
            ],
          }
        } else if (opcion.id === opcionId) {
          return {
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
                ancho: "",
                alto: "",
              },
            ],
          }
        }
        return opcion
      }),
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

  const handleAgregarOpcionConMaterial = () => {
    if (opciones.length > 0 && opciones[opciones.length - 1].ventanas.length > 0) {
      setCurrentOpcionForModal(opciones[opciones.length - 1])
      setSelectedMaterialForOption(0)
      setShowMaterialModal(true)
    } else {
      agregarOpcion()
    }
  }

  const confirmarAgregarOpcionConMaterial = () => {
    if (currentOpcionForModal && selectedMaterialForOption) {
      const newId = (opciones.length + 1).toString()
      const nuevasVentanas = currentOpcionForModal.ventanas.map((v) => ({
        ...v,
        id: Date.now().toString() + Math.random(),
        materialId: selectedMaterialForOption,
      }))

      setOpciones([
        ...opciones,
        {
          id: newId,
          nombre: `Opción ${newId}`,
          ventanas: nuevasVentanas,
          total: 0,
        },
      ])
      setShowMaterialModal(false)
      setCurrentOpcionForModal(null)
    }
  }

  const eliminarOpcion = (opcionId: string) => {
    setOpciones(opciones.filter((o) => o.id !== opcionId))
  }

  const generarPDF = async () => {
    const doc = new jsPDF()

    const fetchImages = async () => {
      try {
        console.log("[v0] Fetching images for PDF...")
        const response = await fetch("/api/imagenes")
        const data = await response.json()
        console.log("[v0] Images fetched:", data)
        return {
          logo: data.imagenes?.find((img: any) => img.tipo === "Logo")?.url || null,
          encabezado: data.imagenes?.find((img: any) => img.tipo === "Encabezado")?.url || null,
          piePagina: data.imagenes?.find((img: any) => img.tipo === "Pie de pagina")?.url || null,
          productos: data.imagenes?.filter((img: any) => img.tipo === "Producto") || [],
        }
      } catch (error) {
        console.error("[v0] Error fetching images:", error)
        return { logo: null, encabezado: null, piePagina: null, productos: [] }
      }
    }

    const images = await fetchImages()
    console.log("[v0] Images loaded for PDF:", images)

    const colors = {
      primary: "#1e3a8a",
      secondary: "#475569",
      accent: "#0ea5e9",
      text: "#1e293b",
      lightGray: "#f1f5f9",
      border: "#cbd5e1",
    }

    let yPosition = 20

    doc.setFontSize(20)
    doc.setTextColor(colors.primary)
    doc.setFont("helvetica", "bold")
    doc.text("COTIZACIÓN", 105, 40, { align: "center" })

    if (images.logo) {
      try {
        console.log("[v0] Adding logo to PDF")
        doc.addImage(images.logo, "PNG", 14, 15, 35, 20)
      } catch (error) {
        console.log("[v0] Error loading logo:", error)
      }
    }

    if (images.encabezado) {
      try {
        console.log("[v0] Adding header image to PDF")
        doc.addImage(images.encabezado, "PNG", 14, 50, 182, 25)
        yPosition = 80
      } catch (error) {
        console.log("[v0] Error loading header:", error)
        yPosition = 55
      }
    } else {
      yPosition = 55
    }

    doc.setFontSize(9)
    doc.setTextColor(colors.secondary)
    doc.text(clientData.empresa || "TermoAcústicos", 196, 20, { align: "right" })
    doc.text(
      `Fecha: ${new Date().toLocaleDateString("es-CL", { year: "numeric", month: "long", day: "numeric" })}`,
      196,
      25,
      { align: "right" },
    )

    opciones.forEach((opcion, opcionIndex) => {
      if (yPosition > 240) {
        doc.addPage()
        yPosition = 20
      }

      doc.setFontSize(14)
      doc.setTextColor(colors.primary)
      doc.setFont("helvetica", "bold")
      doc.text(opcion.nombre, 14, yPosition)
      yPosition += 8

      const tableData = opcion.ventanas
        .filter((v) => v.tipoId && v.materialId)
        .map((v, index) => {
          const tipo = tipos.find((t) => t.id === v.tipoId)
          const material = materiales.find((m) => m.id === v.materialId)
          const cristal = cristales.find((c) => c.id === v.cristalId)
          const color = colores.find((co) => co.id === v.colorId)
          const costoVentana = (() => {
            if (!tipo || !cristal || !color) return 0
            const anchoNum = Number.parseFloat(v.ancho) || 0
            const altoNum = Number.parseFloat(v.alto) || 0
            const metrosCuadrados = (anchoNum / 1000) * (altoNum / 1000)
            const precioBase = tipo.precio_por_m2 * metrosCuadrados
            const precioCristal = cristal.precio * metrosCuadrados
            const precioColor = color.precio * metrosCuadrados
            return (precioBase + precioCristal + precioColor) * v.cantidad
          })()
          const costoQuincalleria = calcularQuincalleria(v)
          const total = costoVentana + costoQuincalleria

          return [
            (index + 1).toString(),
            tipo?.descripcion || "-",
            material?.nombre || "-",
            cristal?.descripcion || "-",
            color?.nombre || "-",
            v.cantidad.toString(),
            `${v.ancho} x ${v.alto} mm`,
            `$${costoQuincalleria.toLocaleString("es-CL")}`,
            `$${total.toLocaleString("es-CL")}`,
          ]
        })

      autoTable(doc, {
        startY: yPosition,
        head: [["N°", "Tipo", "Material", "Cristal", "Color", "Cant.", "Dimensiones", "Quinc.", "Total"]],
        body: tableData,
        theme: "striped",
        headStyles: {
          fillColor: colors.primary,
          textColor: "#ffffff",
          fontSize: 9,
          fontStyle: "bold",
          halign: "center",
        },
        bodyStyles: {
          fontSize: 8,
          textColor: colors.text,
        },
        alternateRowStyles: {
          fillColor: colors.lightGray,
        },
        columnStyles: {
          0: { halign: "center", cellWidth: 10 },
          1: { cellWidth: 38 },
          2: { cellWidth: 30 },
          3: { cellWidth: 22 },
          4: { cellWidth: 22 },
          5: { halign: "center", cellWidth: 12 },
          6: { halign: "center", cellWidth: 28 },
          7: { halign: "right", cellWidth: 18 },
          8: { halign: "right", cellWidth: 22 },
        },
        margin: { left: 14, right: 14 },
      })

      yPosition = (doc as any).lastAutoTable.finalY + 10

      const totalOpcion = opcion.ventanas
        .filter((v) => v.tipoId && v.materialId)
        .reduce((sum, v) => sum + calcularValorTotal(v), 0)

      doc.setFontSize(11)
      doc.setTextColor(colors.primary)
      doc.setFont("helvetica", "bold")
      doc.text(`Subtotal ${opcion.nombre}: $${totalOpcion.toLocaleString("es-CL")}`, 196, yPosition, {
        align: "right",
      })

      yPosition += 15
    })

    if (yPosition > 250) {
      doc.addPage()
      yPosition = 20
    }

    const totalGeneral = opciones.reduce((sum, op) => {
      return (
        sum + op.ventanas.filter((v) => v.tipoId && v.materialId).reduce((vSum, v) => vSum + calcularValorTotal(v), 0)
      )
    }, 0)

    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)

      if (images.piePagina) {
        try {
          doc.addImage(images.piePagina, "PNG", 14, 275, 182, 15)
        } catch (error) {
          console.log("[v0] Error loading footer:", error)
        }
      }

      doc.setFontSize(8)
      doc.setTextColor(colors.secondary)
      doc.text(`Página ${i} de ${pageCount}`, 105, 290, { align: "center" })
    }

    try {
      const pdfBlob = doc.output("blob")
      const fileName = `cotizacion-${clientData.nombre.replace(/\s+/g, "-")}-${Date.now()}.pdf`

      console.log("[v0] Uploading PDF to Blob:", fileName)
      const formData = new FormData()
      formData.append("file", pdfBlob, fileName)

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload PDF")
      }

      const uploadData = await uploadResponse.json()
      console.log("[v0] PDF uploaded successfully:", uploadData.url)

      const cotizacionData = {
        clienteNombre: clientData.nombre,
        clienteRut: clientData.rut,
        clienteCorreo: clientData.email,
        clienteTelefono: clientData.telefono,
        clienteDireccion: clientData.direccion || "",
        precioTotal: totalGeneral,
        pdfUrl: uploadData.url,
        items: opciones.flatMap((op) =>
          op.ventanas
            .filter((v) => v.tipoId && v.materialId)
            .map((v) => ({
              tipoId: v.tipoId,
              materialId: v.materialId,
              cristalId: v.cristalId,
              colorId: v.colorId,
              cantidad: v.cantidad,
              ancho: Number.parseFloat(v.ancho) || 0,
              alto: Number.parseFloat(v.alto) || 0,
              valorTotal: calcularValorTotal(v),
            })),
        ),
      }

      console.log("[v0] Saving cotizacion to database:", cotizacionData)

      const saveResponse = await fetch("/api/cotizaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cotizacionData),
      })

      if (!saveResponse.ok) {
        throw new Error("Failed to save cotizacion")
      }

      const saveData = await saveResponse.json()
      console.log("[v0] Cotizacion saved with ID:", saveData.id)

      // Download PDF for user
      const url = URL.createObjectURL(pdfBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = fileName
      link.click()
      URL.revokeObjectURL(url)

      toast({ title: "Éxito", description: "PDF generado y guardado correctamente" })
    } catch (error) {
      console.error("[v0] Error generating/saving PDF:", error)
      toast({ title: "Error", description: "Error al generar o guardar el PDF", variant: "destructive" })
    }
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
            <Input
              placeholder="Empresa"
              value={clientData.empresa}
              onChange={(e) => setClientData({ ...clientData, empresa: e.target.value })}
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
                            placeholder="0"
                            value={ventana.ancho}
                            onChange={(e) => actualizarVentana(opcion.id, ventana.id, "ancho", e.target.value)}
                            className="w-full h-8 text-center"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <Input
                            type="number"
                            step="0.1"
                            min="0"
                            placeholder="0"
                            value={ventana.alto}
                            onChange={(e) => actualizarVentana(opcion.id, ventana.id, "alto", e.target.value)}
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
        <Button onClick={handleAgregarOpcionConMaterial} variant="outline" className="gap-2 bg-transparent">
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

      {showMaterialModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Seleccionar Material para Nueva Opción</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Material</label>
                <Select
                  value={selectedMaterialForOption.toString()}
                  onValueChange={(value) => setSelectedMaterialForOption(Number.parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar material" />
                  </SelectTrigger>
                  <SelectContent>
                    {materiales.map((material) => (
                      <SelectItem key={material.id} value={material.id.toString()}>
                        {material.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Los demás datos (tipo, cristal, color, dimensiones) se copiarán de la opción anterior
                </p>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowMaterialModal(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={confirmarAgregarOpcionConMaterial}
                  disabled={!selectedMaterialForOption}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  Agregar Opción
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
