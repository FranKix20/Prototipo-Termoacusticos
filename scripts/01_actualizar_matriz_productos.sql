-- Converting all measurements from meters to millimeters (multiply by 1000)
-- Actualizar tabla tipos con los valores de precio por m2 de la matriz
UPDATE tipos SET precio_por_m2 = 42000 WHERE id = 1;
UPDATE tipos SET precio_por_m2 = 42000 WHERE id = 2;
UPDATE tipos SET precio_por_m2 = 42000 WHERE id = 3;
UPDATE tipos SET precio_por_m2 = 42000 WHERE id = 4;
UPDATE tipos SET precio_por_m2 = 42000 WHERE id = 5;
UPDATE tipos SET precio_por_m2 = 42000 WHERE id = 6;

-- Actualizar tabla perfiles con todos los valores de la matriz (medidas en milímetros)
-- CORREADERA GRANDE
UPDATE perfiles SET precio_base = 350000, ancho_base = 3500, alto_base = 2200 WHERE nombre = 'CORREADERA GRANDE 3.5x2.2';
UPDATE perfiles SET precio_base = 320000, ancho_base = 3000, alto_base = 2200 WHERE nombre = 'CORREADERA GRANDE 3.0x2.2';
UPDATE perfiles SET precio_base = 252644, ancho_base = 2320, alto_base = 2200 WHERE nombre = 'CORREADERA GRANDE 2.32x2.2';
UPDATE perfiles SET precio_base = 230000, ancho_base = 2000, alto_base = 2000 WHERE nombre = 'CORREADERA GRANDE 2.0x2.0';
UPDATE perfiles SET precio_base = 200000, ancho_base = 1750, alto_base = 2000 WHERE nombre = 'CORREADERA GRANDE 1.75x2.0';
UPDATE perfiles SET precio_base = 150000, ancho_base = 1500, alto_base = 2000 WHERE nombre = 'CORREADERA GRANDE 1.5x2.0';

-- CORREADERA CHICA
UPDATE perfiles SET precio_base = 139974, ancho_base = 3000, alto_base = 1600 WHERE nombre = 'CORREADERA CHICA 3.0x1.6';
UPDATE perfiles SET precio_base = 139974, ancho_base = 2500, alto_base = 1500 WHERE nombre = 'CORREADERA CHICA 2.5x1.5';
UPDATE perfiles SET precio_base = 99546, ancho_base = 1600, alto_base = 1500 WHERE nombre = 'CORREADERA CHICA 1.6x1.5';
UPDATE perfiles SET precio_base = 92000, ancho_base = 1400, alto_base = 1425 WHERE nombre = 'CORREADERA CHICA 1.4x1.425';
UPDATE perfiles SET precio_base = 80000, ancho_base = 1200, alto_base = 1200 WHERE nombre = 'CORREADERA CHICA 1.2x1.2';
UPDATE perfiles SET precio_base = 70000, ancho_base = 1000, alto_base = 1000 WHERE nombre = 'CORREADERA CHICA 1.0x1.0';

-- FIJO
UPDATE perfiles SET precio_base = 33351, ancho_base = 1600, alto_base = 2200 WHERE nombre = 'FIJO 1.6x2.2';
UPDATE perfiles SET precio_base = 33351, ancho_base = 1500, alto_base = 1500 WHERE nombre = 'FIJO 1.5x1.5';
UPDATE perfiles SET precio_base = 33351, ancho_base = 1200, alto_base = 1500 WHERE nombre = 'FIJO 1.2x1.5';
UPDATE perfiles SET precio_base = 30000, ancho_base = 1200, alto_base = 1300 WHERE nombre = 'FIJO 1.2x1.3';
UPDATE perfiles SET precio_base = 25000, ancho_base = 1000, alto_base = 1000 WHERE nombre = 'FIJO 1.0x1.0';
UPDATE perfiles SET precio_base = 20000, ancho_base = 800, alto_base = 800 WHERE nombre = 'FIJO 0.8x0.8';

-- PROYECTANTE
UPDATE perfiles SET precio_base = 66066, ancho_base = 1100, alto_base = 1100 WHERE nombre = 'PROYECTANTE 1.1x1.1';
UPDATE perfiles SET precio_base = 66066, ancho_base = 1100, alto_base = 950 WHERE nombre = 'PROYECTANTE 1.1x0.95';
UPDATE perfiles SET precio_base = 66066, ancho_base = 700, alto_base = 950 WHERE nombre = 'PROYECTANTE 0.7x0.95';
UPDATE perfiles SET precio_base = 45000, ancho_base = 600, alto_base = 600 WHERE nombre = 'PROYECTANTE 0.6x0.6';
UPDATE perfiles SET precio_base = 30000, ancho_base = 400, alto_base = 600 WHERE nombre = 'PROYECTANTE 0.4x0.6';
UPDATE perfiles SET precio_base = 20000, ancho_base = 300, alto_base = 300 WHERE nombre = 'PROYECTANTE 0.3x0.3';

-- PUERTA
UPDATE perfiles SET precio_base = 138135, ancho_base = 900, alto_base = 2200 WHERE nombre = 'PUERTA 0.9x2.2';
UPDATE perfiles SET precio_base = 138135, ancho_base = 1800, alto_base = 2200 WHERE nombre = 'PUERTA DOBLE 1.8x2.2';

-- ELEMENTO ESPECIAL
UPDATE perfiles SET precio_base = 138135 WHERE nombre = 'ELEMENTO ESPECIAL';
