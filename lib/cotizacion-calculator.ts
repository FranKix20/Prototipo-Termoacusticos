import type { CotizacionData } from "@/components/cotizacion-form"

export interface ResultadoCotizacion {
  material: string
  tipo: string
  anchoM: number
  altoM: number
  termosMts: number
  m2Termos: number
  costoTermos: number
  perfil: number
  herraje: number
  costos: number
  margenPorcentaje: number
  valorMargen: number
  precioVenta: number
  areaTotal: number
  precioUnitario: number
  precioTotal: number
  descuento: number
  descuentoPorcentaje: number
  instalacion: number
  total: number
}

export function getTipoVentanaLabel(tipoId: string): string {
  const labels: Record<string, string> = {
    corredera: "Ventana Corredera",
    proyectante: "Ventana Proyectante",
    fija: "Ventana Fija",
    oscilobatiente: "Ventana Oscilobatiente",
  }
  return labels[tipoId] || tipoId
}

export function getMaterialLabel(materialId: string): string {
  const labels: Record<string, string> = {
    pvc: "PVC",
    aluminio: "Aluminio",
    "pvc-premium": "PVC Premium con Refuerzo",
  }
  return labels[materialId] || materialId
}

export function getTipoVidrioLabel(vidrio: string): string {
  const labels: Record<string, string> = {
    estandar: "Termopanel Estándar (4mm)",
    reforzado: "Termopanel Reforzado (6mm)",
    blindex: "Termopanel Blindex (Laminado)",
    "low-e": "Termopanel Low-E (Bajo Emisivo)",
  }
  return labels[vidrio] || vidrio
}

export function calcularCotizacion(data: CotizacionData): ResultadoCotizacion {
  const anchoM = data.ancho / 100
  const altoM = data.alto / 100

  // Calcular precios base en función del tipo y material
  const preciosBase: Record<string, Record<string, number>> = {
    corredera: { pvc: 45000, aluminio: 62000, "pvc-premium": 55000 },
    proyectante: { pvc: 52000, aluminio: 72000, "pvc-premium": 62000 },
    fija: { pvc: 35000, aluminio: 48000, "pvc-premium": 42000 },
    oscilobatiente: { pvc: 58000, aluminio: 78000, "pvc-premium": 68000 },
  }

  const vidrio_surcharges: Record<string, number> = {
    estandar: 0,
    reforzado: 15000,
    blindex: 35000,
    "low-e": 50000,
  }

  const precioBasePorM2 = preciosBase[data.tipoVentana]?.[data.material] || 45000
  const vidrioSurcharge = vidrio_surcharges[data.tipoVidrio] || 0

  const areaTotal = (data.ancho * data.alto * data.cantidad) / 10000

  const precioUnitario = Math.round((data.ancho * data.alto * precioBasePorM2) / 10000 + vidrioSurcharge)
  const precioTotal = precioUnitario * data.cantidad

  // Descuentos por volumen
  let descuento = 0
  let descuentoPorcentaje = 0
  if (data.cantidad >= 20) {
    descuentoPorcentaje = 15
    descuento = Math.round(precioTotal * 0.15)
  } else if (data.cantidad >= 10) {
    descuentoPorcentaje = 10
    descuento = Math.round(precioTotal * 0.1)
  } else if (data.cantidad >= 5) {
    descuentoPorcentaje = 5
    descuento = Math.round(precioTotal * 0.05)
  }

  const precioConDescuento = precioTotal - descuento
  const costoInstalacion = data.instalacion ? Math.round(25000 * data.cantidad) : 0

  const total = precioConDescuento + costoInstalacion

  return {
    material: data.material,
    tipo: data.tipoVentana,
    anchoM,
    altoM,
    termosMts: anchoM * altoM,
    m2Termos: precioBasePorM2,
    costoTermos: Math.round(areaTotal * precioBasePorM2),
    perfil: 0,
    herraje: 0,
    costos: precioTotal,
    margenPorcentaje: 20,
    valorMargen: Math.round(precioTotal * 0.2),
    precioVenta: precioTotal,
    areaTotal,
    precioUnitario,
    precioTotal,
    descuento,
    descuentoPorcentaje,
    instalacion: costoInstalacion,
    total,
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  }).format(amount)
}
