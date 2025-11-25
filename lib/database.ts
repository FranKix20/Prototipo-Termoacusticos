// Base de datos completamente modificable para TermoAcusticos
// Estructura de datos que se puede editar desde el panel de administración

export interface Tipo {
  id: number
  descripcion: string
  precio_por_m2: number
}

export interface Material {
  id: number
  nombre: string
  textoLibrePDF: string
  texto1: string
  texto2: string
}

export interface Cristal {
  id: number
  descripcion: string
  precio: number
}

export interface Color {
  id: number
  nombre: string
  precio: number
}

export interface Perfil {
  id: number
  nombre: string
  descripcion: string
  precio_base: number
  ancho_base: number
  alto_base: number
}

export interface Quincalleria {
  id: number
  nombre: string
  descripcion: string
  precio: number
}

export interface Imagen {
  id: number
  nombre: string
  url: string
  tipo: "Logo" | "Producto" | "Pie de pagina" | "Encabezado"
  producto_id?: number // Solo requerido cuando tipo es 'Producto'
}

// Interfaz de Usuario
export interface Usuario {
  id: number
  nombre: string
  correo: string
  contraseña: string
  rol: "administrador" | "usuario"
  fechaCreacion: string
}

// Interfaz de Cotización para almacenar historial
export interface Cotizacion {
  id: number
  clienteNombre: string
  clienteCorreo: string
  clienteTelefono: string
  clienteDireccion: string
  items: Array<{
    tipoId: number
    materialId: number
    cristalId: number
    colorId: number
    cantidad: number
    ancho: number
    alto: number
    precioUnitario: number
    precioTotal: number
  }>
  costoDespacho: number
  costoInstalacion: number
  gananciaGlobal: number
  precioTotal: number
  notas: string
  fechaCreacion: string
  estado: "pendiente" | "confirmada" | "completada"
}

// Base de datos inicial con datos reales de TermoAcusticos
export const DATABASE = {
  tipos: [
    {
      id: 1,
      descripcion: "VENTANA CORREDERA CHICA CLASE A",
      precio_por_m2: 175000,
    },
    {
      id: 2,
      descripcion: "VENTANA CORREDERA GRANDE CLASE A",
      precio_por_m2: 155000,
    },
    {
      id: 3,
      descripcion: "VENTANA PAÑO FIJO CLASE A",
      precio_por_m2: 125000,
    },
  ] as Tipo[],

  materiales: [
    {
      id: 1,
      nombre: "ALUMINIO PREMIUM XELENTIA",
      textoLibrePDF: "ALUMINIO PREMIUM XELENTIA® ALTA CALIDAD CON TERMOPANEL TECNOLOGIA WARM EDGE CON GAS ARGÓN",
      texto1: "Profil Premium",
      texto2: "Gas Argón incluido",
    },
    {
      id: 2,
      nombre: "PVC",
      textoLibrePDF: "PVC EUROPEO TOP DE LINEA ALTA CALIDAD CON TERMOPANEL TECNOLOGIA WARM EDGE CON GAS ARGÓN",
      texto1: "Tecnología Europea",
      texto2: "Gas Argón",
    },
    {
      id: 3,
      nombre: "ALUMINIO ESTANDAR",
      textoLibrePDF: "ALUMINIO LINEA ESTANDAR CON TERMOPANEL TRADICIONAL CALIDAD INTERMEDIA CON AIRE SECO",
      texto1: "Línea Estándar",
      texto2: "Aire Seco",
    },
  ] as Material[],

  cristales: [
    {
      id: 1,
      descripcion: "4+10+4mm Termopanel",
      precio: 38000,
    },
    {
      id: 2,
      descripcion: "5+10+5mm Termopanel",
      precio: 45000,
    },
    {
      id: 3,
      descripcion: "4+10+6",
      precio: 48000,
    },
    {
      id: 4,
      descripcion: "4+10+6 Lam",
      precio: 60000,
    },
    {
      id: 5,
      descripcion: "4+12+4",
      precio: 38000,
    },
    {
      id: 6,
      descripcion: "4+10+4 C.Solar",
      precio: 60000,
    },
    {
      id: 7,
      descripcion: "4+12+4 C.Solar",
      precio: 60000,
    },
    {
      id: 8,
      descripcion: "5 mm",
      precio: 25000,
    },
    {
      id: 9,
      descripcion: "4 mm",
      precio: 23000,
    },
    {
      id: 10,
      descripcion: "6 mm",
      precio: 27000,
    },
    {
      id: 11,
      descripcion: "6 mm Lam",
      precio: 38000,
    },
    {
      id: 12,
      descripcion: "8 mm Lam",
      precio: 45000,
    },
    {
      id: 13,
      descripcion: "8 mm",
      precio: 32000,
    },
    {
      id: 14,
      descripcion: "10 mm",
      precio: 38000,
    },
  ] as Cristal[],

  colores: [
    { id: 1, nombre: "NOGAL", precio: 15000 },
    { id: 2, nombre: "TITANIO", precio: 12000 },
    { id: 3, nombre: "MATE", precio: 8000 },
    { id: 4, nombre: "BLANCO", precio: 5000 },
    { id: 5, nombre: "ANTRACITA", precio: 18000 },
    { id: 6, nombre: "ROBLE DORADO", precio: 20000 },
    { id: 7, nombre: "NEGRO", precio: 10000 },
  ] as Color[],

  perfiles: [
    {
      id: 1,
      nombre: "Perfil Clase A",
      descripcion: "Perfil de aluminio premium con aislamiento superior",
      precio_base: 45000,
      ancho_base: 1000,
      alto_base: 1000,
    },
    {
      id: 2,
      nombre: "Perfil Clase B",
      descripcion: "Perfil estándar con buen aislamiento",
      precio_base: 35000,
      ancho_base: 1000,
      alto_base: 1000,
    },
  ] as Perfil[],

  quincallerias: [
    {
      id: 1,
      nombre: "Bisagra Premium",
      descripcion: "Bisagra de acero galvanizado alta calidad",
      precio: 15000,
    },
    {
      id: 2,
      nombre: "Cerradura de Seguridad",
      descripcion: "Cerradura de 3 puntos",
      precio: 25000,
    },
    {
      id: 3,
      nombre: "Manija Ergonómica",
      descripcion: "Manija diseño moderno",
      precio: 8000,
    },
  ] as Quincalleria[],

  imagenes: [] as Imagen[],

  usuarios: [
    {
      id: 1,
      nombre: "Administrador",
      correo: "admin@termoacusticos.com",
      contraseña: "admin123", // En producción usar hash bcrypt
      rol: "administrador",
      fechaCreacion: new Date().toISOString(),
    },
  ] as Usuario[],

  cotizaciones: [] as Cotizacion[],
}

// Funciones para obtener datos
export function getTipos() {
  return DATABASE.tipos
}

export function getMateriales() {
  return DATABASE.materiales
}

export function getCristales() {
  return DATABASE.cristales
}

export function getColores() {
  return DATABASE.colores
}

export function getPerfiles() {
  return DATABASE.perfiles
}

export function getQuincallerias() {
  return DATABASE.quincallerias
}

export function getImagenes() {
  return DATABASE.imagenes
}

export function getUsuarios() {
  return DATABASE.usuarios
}

export function getCotizaciones() {
  return DATABASE.cotizaciones
}

// Funciones para actualizar datos
export function actualizarTipo(id: number, datos: Partial<Tipo>) {
  const index = DATABASE.tipos.findIndex((t) => t.id === id)
  if (index !== -1) {
    DATABASE.tipos[index] = { ...DATABASE.tipos[index], ...datos }
  }
}

export function agregarTipo(tipo: Omit<Tipo, "id">) {
  const newId = Math.max(...DATABASE.tipos.map((t) => t.id), 0) + 1
  DATABASE.tipos.push({ ...tipo, id: newId })
}

export function eliminarTipo(id: number) {
  DATABASE.tipos = DATABASE.tipos.filter((t) => t.id !== id)
}

export function actualizarMaterial(id: number, datos: Partial<Material>) {
  const index = DATABASE.materiales.findIndex((m) => m.id === id)
  if (index !== -1) {
    DATABASE.materiales[index] = { ...DATABASE.materiales[index], ...datos }
  }
}

export function agregarMaterial(material: Omit<Material, "id">) {
  const newId = Math.max(...DATABASE.materiales.map((m) => m.id), 0) + 1
  DATABASE.materiales.push({ ...material, id: newId })
}

export function actualizarCristal(id: number, datos: Partial<Cristal>) {
  const index = DATABASE.cristales.findIndex((c) => c.id === id)
  if (index !== -1) {
    DATABASE.cristales[index] = { ...DATABASE.cristales[index], ...datos }
  }
}

export function agregarCristal(cristal: Omit<Cristal, "id">) {
  const newId = Math.max(...DATABASE.cristales.map((c) => c.id), 0) + 1
  DATABASE.cristales.push({ ...cristal, id: newId })
}

export function actualizarColor(id: number, datos: Partial<Color>) {
  const index = DATABASE.colores.findIndex((c) => c.id === id)
  if (index !== -1) {
    DATABASE.colores[index] = { ...DATABASE.colores[index], ...datos }
  }
}

export function agregarColor(color: Omit<Color, "id">) {
  const newId = Math.max(...DATABASE.colores.map((c) => c.id), 0) + 1
  DATABASE.colores.push({ ...color, id: newId })
}

export function actualizarPerfil(id: number, datos: Partial<Perfil>) {
  const index = DATABASE.perfiles.findIndex((p) => p.id === id)
  if (index !== -1) {
    DATABASE.perfiles[index] = { ...DATABASE.perfiles[index], ...datos }
  }
}

export function agregarPerfil(perfil: Omit<Perfil, "id">) {
  const newId = Math.max(...DATABASE.perfiles.map((p) => p.id), 0) + 1
  DATABASE.perfiles.push({ ...perfil, id: newId })
}

export function actualizarQuincalleria(id: number, datos: Partial<Quincalleria>) {
  const index = DATABASE.quincallerias.findIndex((q) => q.id === id)
  if (index !== -1) {
    DATABASE.quincallerias[index] = { ...DATABASE.quincallerias[index], ...datos }
  }
}

export function agregarQuincalleria(quincalleria: Omit<Quincalleria, "id">) {
  const newId = Math.max(...DATABASE.quincallerias.map((q) => q.id), 0) + 1
  DATABASE.quincallerias.push({ ...quincalleria, id: newId })
}

export function agregarUsuario(usuario: Omit<Usuario, "id" | "fechaCreacion">) {
  const newId = Math.max(...DATABASE.usuarios.map((u) => u.id), 0) + 1
  DATABASE.usuarios.push({
    ...usuario,
    id: newId,
    rol: usuario.rol || "usuario",
    fechaCreacion: new Date().toISOString(),
  })
  return newId
}

export function actualizarUsuario(id: number, datos: Partial<Omit<Usuario, "id" | "fechaCreacion">>) {
  const index = DATABASE.usuarios.findIndex((u) => u.id === id)
  if (index !== -1) {
    DATABASE.usuarios[index] = { ...DATABASE.usuarios[index], ...datos }
  }
}

export function eliminarUsuario(id: number) {
  DATABASE.usuarios = DATABASE.usuarios.filter((u) => u.id !== id)
}

export function agregarCotizacion(cotizacion: Omit<Cotizacion, "id" | "fechaCreacion">) {
  const newId = Math.max(...DATABASE.cotizaciones.map((c) => c.id), 0) + 1
  DATABASE.cotizaciones.push({
    ...cotizacion,
    id: newId,
    fechaCreacion: new Date().toISOString(),
  })
  return newId
}

export function actualizarCotizacion(id: number, datos: Partial<Omit<Cotizacion, "id" | "fechaCreacion">>) {
  const index = DATABASE.cotizaciones.findIndex((c) => c.id === id)
  if (index !== -1) {
    DATABASE.cotizaciones[index] = { ...DATABASE.cotizaciones[index], ...datos }
  }
}

export function eliminarCotizacion(id: number) {
  DATABASE.cotizaciones = DATABASE.cotizaciones.filter((c) => c.id !== id)
}

// Función para validar login contra base de datos de usuarios
export function validarCredenciales(correo: string, contraseña: string) {
  const usuario = DATABASE.usuarios.find((u) => u.correo === correo && u.contraseña === contraseña)
  return usuario || null
}
