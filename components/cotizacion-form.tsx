"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Calculator, Ruler, Package } from "lucide-react"

export interface CotizacionData {
  tipoVentana: string
  material: string
  ancho: number
  alto: number
  cantidad: number
  tipoVidrio: string
  instalacion: boolean
}

interface CotizacionFormProps {
  onCotizar: (data: CotizacionData) => void
}

export function CotizacionForm({ onCotizar }: CotizacionFormProps) {
  const [formData, setFormData] = useState<CotizacionData>({
    tipoVentana: "",
    material: "",
    ancho: 100,
    alto: 100,
    cantidad: 1,
    tipoVidrio: "",
    instalacion: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCotizar(formData)
  }

  const isFormValid =
    formData.tipoVentana && formData.material && formData.tipoVidrio && formData.ancho > 0 && formData.alto > 0

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <Package className="h-5 w-5 text-primary" />
            Tipo de Producto
          </CardTitle>
          <CardDescription>Selecciona el tipo de ventana que necesitas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tipoVentana">Tipo de Ventana</Label>
            <Select
              value={formData.tipoVentana}
              onValueChange={(value) => setFormData({ ...formData, tipoVentana: value })}
            >
              <SelectTrigger id="tipoVentana">
                <SelectValue placeholder="Selecciona un tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="corredera">Ventana Corredera</SelectItem>
                <SelectItem value="proyectante">Ventana Proyectante</SelectItem>
                <SelectItem value="fija">Ventana Fija</SelectItem>
                <SelectItem value="oscilobatiente">Ventana Oscilobatiente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="material">Material del Marco</Label>
            <Select value={formData.material} onValueChange={(value) => setFormData({ ...formData, material: value })}>
              <SelectTrigger id="material">
                <SelectValue placeholder="Selecciona un material" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pvc">PVC (Recomendado)</SelectItem>
                <SelectItem value="aluminio">Aluminio</SelectItem>
                <SelectItem value="pvc-premium">PVC Premium con Refuerzo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipoVidrio">Tipo de Vidrio</Label>
            <Select
              value={formData.tipoVidrio}
              onValueChange={(value) => setFormData({ ...formData, tipoVidrio: value })}
            >
              <SelectTrigger id="tipoVidrio">
                <SelectValue placeholder="Selecciona el tipo de vidrio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="estandar">Termopanel Estándar (4mm)</SelectItem>
                <SelectItem value="reforzado">Termopanel Reforzado (6mm)</SelectItem>
                <SelectItem value="blindex">Termopanel Blindex (Laminado)</SelectItem>
                <SelectItem value="low-e">Termopanel Low-E (Bajo Emisivo)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <Ruler className="h-5 w-5 text-primary" />
            Medidas y Cantidad
          </CardTitle>
          <CardDescription>Ingresa las dimensiones en centímetros</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ancho">Ancho (cm)</Label>
              <Input
                id="ancho"
                type="number"
                min="40"
                max="300"
                value={formData.ancho}
                onChange={(e) => setFormData({ ...formData, ancho: Number.parseInt(e.target.value) || 0 })}
                placeholder="100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="alto">Alto (cm)</Label>
              <Input
                id="alto"
                type="number"
                min="40"
                max="300"
                value={formData.alto}
                onChange={(e) => setFormData({ ...formData, alto: Number.parseInt(e.target.value) || 0 })}
                placeholder="100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="cantidad">Cantidad de Ventanas</Label>
              <span className="text-sm font-medium text-foreground">{formData.cantidad}</span>
            </div>
            <Slider
              id="cantidad"
              min={1}
              max={20}
              step={1}
              value={[formData.cantidad]}
              onValueChange={(value) => setFormData({ ...formData, cantidad: value[0] })}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 ventana</span>
              <span>20 ventanas</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 rounded-lg border border-border bg-secondary/30 p-4">
            <input
              type="checkbox"
              id="instalacion"
              checked={formData.instalacion}
              onChange={(e) => setFormData({ ...formData, instalacion: e.target.checked })}
              className="h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2"
            />
            <Label
              htmlFor="instalacion"
              className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Incluir servicio de instalación profesional
            </Label>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" size="lg" className="w-full gap-2" disabled={!isFormValid}>
        <Calculator className="h-5 w-5" />
        Calcular Cotización
      </Button>
    </form>
  )
}
