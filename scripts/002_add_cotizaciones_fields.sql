-- Agregar campos faltantes a la tabla cotizaciones para el historial completo
ALTER TABLE cotizaciones
ADD COLUMN IF NOT EXISTS cliente_rut TEXT;

-- Crear índice para búsquedas más rápidas por fecha
CREATE INDEX IF NOT EXISTS idx_cotizaciones_created_at ON cotizaciones(created_at DESC);

-- Crear índice para búsquedas por RUT del cliente
CREATE INDEX IF NOT EXISTS idx_cotizaciones_cliente_rut ON cotizaciones(cliente_rut);
