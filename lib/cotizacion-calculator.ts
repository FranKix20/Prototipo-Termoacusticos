import type { CotizacionData } from "@/components/cotizacion-form"
import { encontrarProductoCercano } from "./productos-database"

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
}

export function calcularCotizacion(data: CotizacionData): ResultadoCotizacion {
  const anchoM = data.ancho / 100
  const altoM = data.alto / 100

  // Find matching product
  const producto = encontrarProductoCercano(data.material, data.tipo, anchoM, altoM)

  if (!producto) {
    throw new Error(`No se encontró producto para: ${data.material} - ${data.tipo}`)
  }

  const termosMts = anchoM * altoM

  const m2Termos = producto.precio_por_m2 || 42000

  const costoTermos = Math.round(termosMts * m2Termos)

  const perfil = producto.precio_base || 0
  const herraje = producto.herraje || 0

  const costos = perfil + herraje + costoTermos

  const margenPorcentaje = producto.margenPorcentaje || 83
  const valorMargen = Math.round(costos * (margenPorcentaje / 100))

  const precioVenta = costos + valorMargen

  return {
    material: data.material,
    tipo: data.tipo,
    anchoM,
    altoM,
    termosMts,
    m2Termos,
    costoTermos,
    perfil,
    herraje,
    costos,
    margenPorcentaje,
    valorMargen,
    precioVenta,
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  }).format(amount)
}
