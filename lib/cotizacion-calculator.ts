import type { CotizacionData } from "@/components/cotizacion-form"
import {
  getProductoById,
  getMaterialById,
  getTipoVidrioById,
  calcularDescuentoVolumen,
  PRECIOS_ADICIONALES,
} from "./productos-database"

export interface ResultadoCotizacion {
  precioUnitario: number
  precioTotal: number
  instalacion: number
  descuento: number
  subtotal: number
  total: number
  areaTotal: number
  descuentoPorcentaje: number
}

export function calcularCotizacion(data: CotizacionData): ResultadoCotizacion {
  // Calcular área en m²
  const areaM2 = (data.ancho * data.alto) / 10000
  const areaTotal = areaM2 * data.cantidad

  // Obtener datos de productos
  const producto = getProductoById(data.tipoVentana)
  const material = getMaterialById(data.material)
  const vidrio = getTipoVidrioById(data.tipoVidrio)

  // Validar que existan los datos
  if (!producto || !material || !vidrio) {
    throw new Error("Datos de producto inválidos")
  }

  // Calcular precio base por m²
  const precioBase = producto.precioBaseM2

  // Aplicar multiplicadores
  const multiplicadorMaterial = material.multiplicador
  const multiplicadorVidrio = vidrio.multiplicador

  // Calcular precio por m²
  const precioPorM2 = precioBase * multiplicadorMaterial * multiplicadorVidrio

  // Calcular precio unitario
  const precioUnitario = Math.round(precioPorM2 * areaM2)

  // Calcular subtotal de ventanas
  const subtotalVentanas = precioUnitario * data.cantidad

  // Calcular descuento por volumen
  const descuentoPorcentaje = calcularDescuentoVolumen(data.cantidad)
  const montoDescuento = Math.round(subtotalVentanas * descuentoPorcentaje)

  // Calcular precio total con descuento
  const precioTotal = subtotalVentanas - montoDescuento

  // Calcular costo de instalación si aplica
  const costoInstalacion = data.instalacion ? Math.round(PRECIOS_ADICIONALES.instalacionPorM2 * areaTotal) : 0

  // Calcular subtotal antes de IVA
  const subtotal = precioTotal + costoInstalacion

  // Calcular total final (ya incluye IVA en los precios base)
  const total = subtotal

  return {
    precioUnitario,
    precioTotal: subtotalVentanas,
    instalacion: costoInstalacion,
    descuento: montoDescuento,
    subtotal,
    total,
    areaTotal,
    descuentoPorcentaje: descuentoPorcentaje * 100,
  }
}

// Función para formatear moneda chilena
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  }).format(amount)
}

// Función para obtener etiqueta de tipo de ventana
export function getTipoVentanaLabel(tipo: string): string {
  const labels: Record<string, string> = {
    corredera: "Ventana Corredera",
    proyectante: "Ventana Proyectante",
    fija: "Ventana Fija",
    oscilobatiente: "Ventana Oscilobatiente",
  }
  return labels[tipo] || tipo
}

// Función para obtener etiqueta de material
export function getMaterialLabel(material: string): string {
  const labels: Record<string, string> = {
    pvc: "PVC Estándar",
    aluminio: "Aluminio",
    "pvc-premium": "PVC Premium con Refuerzo",
  }
  return labels[material] || material
}

// Función para obtener etiqueta de tipo de vidrio
export function getTipoVidrioLabel(tipo: string): string {
  const labels: Record<string, string> = {
    estandar: "Termopanel Estándar (4mm)",
    reforzado: "Termopanel Reforzado (6mm)",
    blindex: "Termopanel Blindex (Laminado)",
    "low-e": "Termopanel Low-E (Bajo Emisivo)",
  }
  return labels[tipo] || tipo
}
