-- Adding precio column to colores table
ALTER TABLE colores ADD COLUMN IF NOT EXISTS precio NUMERIC DEFAULT 0;

-- Updating tipos table structure - remove unnecessary fields
ALTER TABLE tipos DROP COLUMN IF EXISTS material_id CASCADE;
ALTER TABLE tipos DROP COLUMN IF EXISTS ancho CASCADE;
ALTER TABLE tipos DROP COLUMN IF EXISTS alto CASCADE;
ALTER TABLE tipos DROP COLUMN IF EXISTS cantidad_cristal CASCADE;
ALTER TABLE tipos DROP COLUMN IF EXISTS porcentaje_quincalleria CASCADE;
ALTER TABLE tipos DROP COLUMN IF EXISTS largo_perfiles CASCADE;
ALTER TABLE tipos DROP COLUMN IF EXISTS minimo CASCADE;
ALTER TABLE tipos DROP COLUMN IF EXISTS maximo CASCADE;
ALTER TABLE tipos DROP COLUMN IF EXISTS ganancia CASCADE;

-- Add precio_por_m2 to tipos
ALTER TABLE tipos ADD COLUMN IF NOT EXISTS precio_por_m2 NUMERIC DEFAULT 0;

-- Update perfiles table structure
ALTER TABLE perfiles DROP COLUMN IF EXISTS grosor CASCADE;
ALTER TABLE perfiles ADD COLUMN IF NOT EXISTS precio_base NUMERIC DEFAULT 0;
ALTER TABLE perfiles ADD COLUMN IF NOT EXISTS ancho_base NUMERIC DEFAULT 0;
ALTER TABLE perfiles ADD COLUMN IF NOT EXISTS alto_base NUMERIC DEFAULT 0;

-- Update existing data with new structure
UPDATE colores SET precio = 0 WHERE precio IS NULL;
UPDATE tipos SET precio_por_m2 = 50000 WHERE precio_por_m2 = 0 OR precio_por_m2 IS NULL;
UPDATE perfiles SET precio_base = 0 WHERE precio_base IS NULL;
UPDATE perfiles SET ancho_base = 1000 WHERE ancho_base = 0 OR ancho_base IS NULL;
UPDATE perfiles SET alto_base = 1000 WHERE alto_base = 0 OR alto_base IS NULL;
