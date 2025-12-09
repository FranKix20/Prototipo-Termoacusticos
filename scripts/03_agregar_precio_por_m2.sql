-- Add precio_por_m2 column to perfiles table
ALTER TABLE perfiles ADD COLUMN precio_por_m2 NUMERIC DEFAULT 42000;

-- Actualizar todos los perfiles existentes con el precio por m2
UPDATE perfiles SET precio_por_m2 = 42000 WHERE nombre LIKE '%CORREADERA%';
UPDATE perfiles SET precio_por_m2 = 42000 WHERE nombre LIKE '%FIJO%';
UPDATE perfiles SET precio_por_m2 = 42000 WHERE nombre LIKE '%PROYECTANTE%';
UPDATE perfiles SET precio_por_m2 = 42000 WHERE nombre LIKE '%PUERTA%';
UPDATE perfiles SET precio_por_m2 = 42000 WHERE nombre LIKE '%ELEMENTO%';

-- Para CORREADERA GRANDE especial (2.000 x 2.000)
UPDATE perfiles SET precio_base = 230000, precio_por_m2 = 42000 WHERE nombre = 'CORREADERA GRANDE 2000x2000';
