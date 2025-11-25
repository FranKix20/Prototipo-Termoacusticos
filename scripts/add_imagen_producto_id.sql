-- Agregar columna producto_id a la tabla imagenes
ALTER TABLE imagenes
ADD COLUMN IF NOT EXISTS producto_id BIGINT REFERENCES tipos(id) ON DELETE SET NULL;

-- Actualizar imagenes existentes para que tengan tipo 'Producto' por defecto
UPDATE imagenes
SET tipo = 'Producto'
WHERE tipo IS NULL OR tipo = '';
