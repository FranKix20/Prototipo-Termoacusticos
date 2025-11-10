// Base de datos de productos con precios reales actualizados (2025)
// Basado en investigación de mercado chileno

export interface Producto {
  id: string
  nombre: string
  tipo: string
  descripcion: string
  precioBaseM2: number
  caracteristicas: string[]
  imagen?: string
}

export interface MaterialMarco {
  id: string
  nombre: string
  descripcion: string
  multiplicador: number
  caracteristicas: string[]
}

export interface TipoVidrio {
  id: string
  nombre: string
  descripcion: string
  multiplicador: number
  grosor: string
  caracteristicas: string[]
}

// Catálogo de tipos de ventanas
export const TIPOS_VENTANAS: Producto[] = [
  {
    id: "corredera",
    nombre: "Ventana Corredera",
    tipo: "corredera",
    descripcion: "Sistema de apertura horizontal deslizante, ideal para espacios reducidos",
    precioBaseM2: 85000,
    caracteristicas: [
      "Apertura horizontal deslizante",
      "Ahorro de espacio",
      "Fácil mantenimiento",
      "Ideal para balcones y terrazas",
    ],
  },
  {
    id: "proyectante",
    nombre: "Ventana Proyectante",
    tipo: "proyectante",
    descripcion: "Apertura hacia afuera, excelente ventilación y protección contra lluvia",
    precioBaseM2: 92000,
    caracteristicas: [
      "Apertura hacia el exterior",
      "Ventilación superior",
      "Protección contra lluvia",
      "Ideal para baños y cocinas",
    ],
  },
  {
    id: "fija",
    nombre: "Ventana Fija",
    tipo: "fija",
    descripcion: "Sin apertura, máxima eficiencia térmica y luminosidad",
    precioBaseM2: 75000,
    caracteristicas: [
      "Sin mecanismo de apertura",
      "Mayor eficiencia térmica",
      "Máxima entrada de luz",
      "Ideal para grandes superficies",
    ],
  },
  {
    id: "oscilobatiente",
    nombre: "Ventana Oscilobatiente",
    tipo: "oscilobatiente",
    descripcion: "Doble sistema de apertura: abatible y basculante",
    precioBaseM2: 105000,
    caracteristicas: ["Doble sistema de apertura", "Máxima versatilidad", "Ventilación controlada", "Alta seguridad"],
  },
]

// Catálogo de materiales de marco
export const MATERIALES_MARCO: MaterialMarco[] = [
  {
    id: "pvc",
    nombre: "PVC Estándar",
    descripcion: "Material aislante de alta calidad, bajo mantenimiento",
    multiplicador: 1.0,
    caracteristicas: [
      "Excelente aislamiento térmico",
      "Resistente a la humedad",
      "Bajo mantenimiento",
      "Durabilidad de 30+ años",
    ],
  },
  {
    id: "aluminio",
    nombre: "Aluminio",
    descripcion: "Ligero y resistente, ideal para grandes dimensiones",
    multiplicador: 0.85,
    caracteristicas: [
      "Ligero y resistente",
      "Ideal para grandes ventanas",
      "Acabado moderno",
      "Resistente a la corrosión",
    ],
  },
  {
    id: "pvc-premium",
    nombre: "PVC Premium con Refuerzo",
    descripcion: "PVC reforzado con acero galvanizado, máxima resistencia",
    multiplicador: 1.25,
    caracteristicas: [
      "Refuerzo de acero galvanizado",
      "Máxima resistencia estructural",
      "Ideal para grandes dimensiones",
      "Certificación europea",
    ],
  },
]

// Catálogo de tipos de vidrio
export const TIPOS_VIDRIO: TipoVidrio[] = [
  {
    id: "estandar",
    nombre: "Termopanel Estándar",
    descripcion: "Doble vidrio con cámara de aire, aislamiento térmico básico",
    multiplicador: 1.0,
    grosor: "4mm + 12mm cámara + 4mm",
    caracteristicas: ["Doble vidrio hermético", "Cámara de aire de 12mm", "Reducción de ruido 30dB", "Filtro UV 99%"],
  },
  {
    id: "reforzado",
    nombre: "Termopanel Reforzado",
    descripcion: "Vidrio de 6mm, mayor resistencia y aislamiento",
    multiplicador: 1.15,
    grosor: "6mm + 16mm cámara + 6mm",
    caracteristicas: [
      "Vidrio reforzado 6mm",
      "Cámara de aire de 16mm",
      "Reducción de ruido 35dB",
      "Mayor resistencia a impactos",
    ],
  },
  {
    id: "blindex",
    nombre: "Termopanel Blindex",
    descripcion: "Vidrio laminado de seguridad, máxima protección",
    multiplicador: 1.35,
    grosor: "3mm+3mm laminado + 12mm cámara + 4mm",
    caracteristicas: [
      "Vidrio laminado de seguridad",
      "Protección contra roturas",
      "Filtro UV 99.9%",
      "Reducción de ruido 38dB",
    ],
  },
  {
    id: "low-e",
    nombre: "Termopanel Low-E",
    descripcion: "Vidrio bajo emisivo, máxima eficiencia energética",
    multiplicador: 1.45,
    grosor: "4mm Low-E + 16mm argón + 4mm",
    caracteristicas: [
      "Capa de baja emisividad",
      "Cámara con gas argón",
      "Máxima eficiencia energética",
      "Reducción de ruido 40dB",
    ],
  },
]

// Precios adicionales
export const PRECIOS_ADICIONALES = {
  instalacionPorM2: 25000,
  transporteBase: 15000,
  transportePorKm: 500,
  urgencia24h: 50000,
  urgencia48h: 30000,
  garantiaExtendida: 45000,
}

// Descuentos por volumen
export const DESCUENTOS_VOLUMEN = [
  { cantidadMinima: 1, descuento: 0 },
  { cantidadMinima: 5, descuento: 0.05 }, // 5% descuento
  { cantidadMinima: 10, descuento: 0.1 }, // 10% descuento
  { cantidadMinima: 20, descuento: 0.15 }, // 15% descuento
]

// Función para obtener producto por ID
export function getProductoById(id: string): Producto | undefined {
  return TIPOS_VENTANAS.find((p) => p.id === id)
}

// Función para obtener material por ID
export function getMaterialById(id: string): MaterialMarco | undefined {
  return MATERIALES_MARCO.find((m) => m.id === id)
}

// Función para obtener tipo de vidrio por ID
export function getTipoVidrioById(id: string): TipoVidrio | undefined {
  return TIPOS_VIDRIO.find((v) => v.id === id)
}

// Función para calcular descuento por volumen
export function calcularDescuentoVolumen(cantidad: number): number {
  const descuento = [...DESCUENTOS_VOLUMEN].reverse().find((d) => cantidad >= d.cantidadMinima)
  return descuento?.descuento || 0
}
