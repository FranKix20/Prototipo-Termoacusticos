"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Download, CheckCircle2, Percent } from "lucide-react"
import type { CotizacionData } from "./cotizacion-form"
import type { ResultadoCotizacion } from "@/lib/cotizacion-calculator"
import { formatCurrency, getTipoVentanaLabel, getMaterialLabel, getTipoVidrioLabel } from "@/lib/cotizacion-calculator"
import { generarPDFCotizacion } from "@/lib/pdf-generator"
import { EmailDialog } from "./email-dialog"

interface CotizacionResultadoProps {
  data: CotizacionData
  resultado: ResultadoCotizacion
  onNuevaCotizacion: () => void
}

export function CotizacionResultado({ data, resultado, onNuevaCotizacion }: CotizacionResultadoProps) {
  const handleDescargarPDF = () => {
    generarPDFCotizacion(data, resultado)
  }

  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary bg-card shadow-lg">
        <CardHeader className="bg-primary/5">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl text-card-foreground">
                <CheckCircle2 className="h-6 w-6 text-primary" />
                Cotización Generada
              </CardTitle>
              <CardDescription>Resumen detallado de tu cotización personalizada</CardDescription>
            </div>
            {resultado.descuentoPorcentaje > 0 && (
              <Badge variant="secondary" className="gap-1 bg-accent text-accent-foreground">
                <Percent className="h-3 w-3" />
                {resultado.descuentoPorcentaje}% descuento
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Detalles del Producto */}
          <div>
            <h3 className="mb-4 font-sans text-lg font-semibold text-card-foreground">Detalles del Producto</h3>
            <div className="space-y-3 rounded-lg bg-secondary/30 p-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tipo de Ventana:</span>
                <span className="font-medium text-card-foreground">{getTipoVentanaLabel(data.tipoVentana)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Material del Marco:</span>
                <span className="font-medium text-card-foreground">{getMaterialLabel(data.material)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tipo de Vidrio:</span>
                <span className="font-medium text-card-foreground">{getTipoVidrioLabel(data.tipoVidrio)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dimensiones:</span>
                <span className="font-medium text-card-foreground">
                  {data.ancho} cm × {data.alto} cm
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Área por ventana:</span>
                <span className="font-medium text-card-foreground">
                  {((data.ancho * data.alto) / 10000).toFixed(2)} m²
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cantidad:</span>
                <span className="font-medium text-card-foreground">{data.cantidad} unidad(es)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Área Total:</span>
                <span className="font-medium text-card-foreground">{resultado.areaTotal.toFixed(2)} m²</span>
              </div>
            </div>
          </div>

          {/* Desglose de Precios */}
          <div>
            <h3 className="mb-4 font-sans text-lg font-semibold text-card-foreground">Desglose de Precios</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-muted-foreground">
                <span>Precio unitario:</span>
                <span>{formatCurrency(resultado.precioUnitario)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal ({data.cantidad} unidades):</span>
                <span>{formatCurrency(resultado.precioTotal)}</span>
              </div>
              {resultado.descuento > 0 && (
                <div className="flex justify-between text-accent">
                  <span>Descuento por volumen ({resultado.descuentoPorcentaje}%):</span>
                  <span>-{formatCurrency(resultado.descuento)}</span>
                </div>
              )}
              {data.instalacion && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Instalación profesional:</span>
                  <span>{formatCurrency(resultado.instalacion)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-xl font-bold text-card-foreground">
                <span>Total:</span>
                <span className="text-primary">{formatCurrency(resultado.total)}</span>
              </div>
            </div>
          </div>

          {/* Información de Descuentos */}
          {resultado.descuentoPorcentaje === 0 && data.cantidad < 5 && (
            <div className="rounded-lg border border-accent/30 bg-accent/10 p-4">
              <h4 className="mb-2 flex items-center gap-2 font-sans font-semibold text-card-foreground">
                <Percent className="h-4 w-4 text-accent" />
                Descuentos por Volumen Disponibles
              </h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• 5+ ventanas: 5% de descuento</li>
                <li>• 10+ ventanas: 10% de descuento</li>
                <li>• 20+ ventanas: 15% de descuento</li>
              </ul>
            </div>
          )}

          {/* Información Adicional */}
          <div className="rounded-lg border border-border bg-secondary/20 p-4">
            <h4 className="mb-2 font-sans font-semibold text-card-foreground">Información Importante</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Precios incluyen IVA</li>
              <li>• Garantía de 5 años en productos</li>
              <li>• Instalación realizada por profesionales certificados</li>
              <li>• Tiempo de entrega: 15-20 días hábiles</li>
              <li>• Cotización válida por 30 días</li>
            </ul>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={handleDescargarPDF} variant="default" className="flex-1 gap-2">
              <Download className="h-4 w-4" />
              Descargar PDF
            </Button>
            <EmailDialog data={data} resultado={resultado} />
          </div>

          <Button onClick={onNuevaCotizacion} variant="ghost" className="w-full">
            Nueva Cotización
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
