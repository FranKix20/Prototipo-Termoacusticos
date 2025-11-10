-- Crear tabla de tipos
CREATE TABLE IF NOT EXISTS tipos (
  id BIGSERIAL PRIMARY KEY,
  descripcion TEXT NOT NULL,
  material_id BIGINT NOT NULL,
  ancho TEXT NOT NULL,
  alto TEXT NOT NULL,
  cantidad_cristal TEXT NOT NULL,
  porcentaje_quincalleria NUMERIC NOT NULL DEFAULT 0,
  largo_perfiles NUMERIC NOT NULL DEFAULT 0,
  minimo NUMERIC NOT NULL DEFAULT 0,
  maximo NUMERIC NOT NULL DEFAULT 0,
  ganancia NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de materiales
CREATE TABLE IF NOT EXISTS materiales (
  id BIGSERIAL PRIMARY KEY,
  nombre TEXT NOT NULL UNIQUE,
  texto_libre_pdf TEXT,
  texto1 TEXT,
  texto2 TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de cristales
CREATE TABLE IF NOT EXISTS cristales (
  id BIGSERIAL PRIMARY KEY,
  descripcion TEXT NOT NULL,
  precio NUMERIC NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de colores
CREATE TABLE IF NOT EXISTS colores (
  id BIGSERIAL PRIMARY KEY,
  nombre TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de perfiles
CREATE TABLE IF NOT EXISTS perfiles (
  id BIGSERIAL PRIMARY KEY,
  nombre TEXT NOT NULL UNIQUE,
  descripcion TEXT,
  grosor NUMERIC NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de quincalleria
CREATE TABLE IF NOT EXISTS quincalleria (
  id BIGSERIAL PRIMARY KEY,
  nombre TEXT NOT NULL UNIQUE,
  descripcion TEXT,
  precio NUMERIC NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de imágenes
CREATE TABLE IF NOT EXISTS imagenes (
  id BIGSERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  url TEXT NOT NULL,
  tipo TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de cotizaciones
CREATE TABLE IF NOT EXISTS cotizaciones (
  id BIGSERIAL PRIMARY KEY,
  cliente_nombre TEXT NOT NULL,
  cliente_correo TEXT NOT NULL,
  cliente_telefono TEXT,
  cliente_direccion TEXT,
  costo_despacho NUMERIC DEFAULT 0,
  costo_instalacion NUMERIC DEFAULT 0,
  ganancia_global NUMERIC DEFAULT 0,
  precio_total NUMERIC NOT NULL,
  notas TEXT,
  estado TEXT DEFAULT 'pendiente',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de items de cotización
CREATE TABLE IF NOT EXISTS cotizacion_items (
  id BIGSERIAL PRIMARY KEY,
  cotizacion_id BIGINT NOT NULL REFERENCES cotizaciones(id) ON DELETE CASCADE,
  tipo_id BIGINT NOT NULL,
  material_id BIGINT NOT NULL,
  cristal_id BIGINT NOT NULL,
  color_id BIGINT NOT NULL,
  cantidad NUMERIC NOT NULL,
  ancho NUMERIC NOT NULL,
  alto NUMERIC NOT NULL,
  precio_unitario NUMERIC NOT NULL,
  precio_total NUMERIC NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Agregar foreign keys
ALTER TABLE tipos ADD CONSTRAINT fk_tipos_material FOREIGN KEY (material_id) REFERENCES materiales(id) ON DELETE CASCADE;

-- Crear índices para mejor rendimiento
CREATE INDEX idx_tipos_material ON tipos(material_id);
CREATE INDEX idx_cotizacion_items_cotizacion ON cotizacion_items(cotizacion_id);
CREATE INDEX idx_cotizaciones_estado ON cotizaciones(estado);
