-- Removed ON CONFLICT clause as table constraints don't support the specified columns
-- INSERTAR TIPOS DE PRODUCTOS con precio_por_m2 = 42000 (según matriz)
INSERT INTO tipos (descripcion, precio_por_m2, created_at, updated_at) VALUES
('CORREADERA GRANDE', 42000, NOW(), NOW()),
('CORREADERA CHICA', 42000, NOW(), NOW()),
('FIJO', 42000, NOW(), NOW()),
('PROYECTANTE', 42000, NOW(), NOW()),
('PUERTA', 42000, NOW(), NOW()),
('ELEMENTO ESPECIAL', 42000, NOW(), NOW());

-- INSERTAR QUINCALLERIA (HERRAJE)
INSERT INTO quincalleria (nombre, descripcion, precio, created_at, updated_at) VALUES
('Herraje Estándar', 'Herraje para perfiles estándar', 0, NOW(), NOW());

-- INSERTAR PERFILES - CORREADERA GRANDE (todas las medidas en milímetros)
INSERT INTO perfiles (nombre, descripcion, precio_base, ancho_base, alto_base, created_at, updated_at) VALUES
('CORREADERA GRANDE 3500x2200', 'Correadera Grande', 350000, 3500, 2200, NOW(), NOW()),
('CORREADERA GRANDE 3000x2200', 'Correadera Grande', 320000, 3000, 2200, NOW(), NOW()),
('CORREADERA GRANDE 2320x2200', 'Correadera Grande', 252644, 2320, 2200, NOW(), NOW()),
('CORREADERA GRANDE 2000x2000', 'Correadera Grande', 230000, 2000, 2000, NOW(), NOW()),
('CORREADERA GRANDE 1750x2000', 'Correadera Grande', 200000, 1750, 2000, NOW(), NOW()),
('CORREADERA GRANDE 1500x2000', 'Correadera Grande', 150000, 1500, 2000, NOW(), NOW()),

-- INSERTAR PERFILES - CORREADERA CHICA
('CORREADERA CHICA 3000x1600', 'Correadera Chica', 139974, 3000, 1600, NOW(), NOW()),
('CORREADERA CHICA 2500x1500', 'Correadera Chica', 139974, 2500, 1500, NOW(), NOW()),
('CORREADERA CHICA 1600x1500', 'Correadera Chica', 99546, 1600, 1500, NOW(), NOW()),
('CORREADERA CHICA 1400x1425', 'Correadera Chica', 92000, 1400, 1425, NOW(), NOW()),
('CORREADERA CHICA 1200x1200', 'Correadera Chica', 80000, 1200, 1200, NOW(), NOW()),
('CORREADERA CHICA 1000x1000', 'Correadera Chica', 70000, 1000, 1000, NOW(), NOW()),

-- INSERTAR PERFILES - FIJO
('FIJO 1600x2200', 'Fijo', 33351, 1600, 2200, NOW(), NOW()),
('FIJO 1500x1500', 'Fijo', 33351, 1500, 1500, NOW(), NOW()),
('FIJO 1200x1500', 'Fijo', 33351, 1200, 1500, NOW(), NOW()),
('FIJO 1200x1300', 'Fijo', 30000, 1200, 1300, NOW(), NOW()),
('FIJO 1000x1000', 'Fijo', 25000, 1000, 1000, NOW(), NOW()),
('FIJO 800x800', 'Fijo', 20000, 800, 800, NOW(), NOW()),

-- INSERTAR PERFILES - PROYECTANTE
('PROYECTANTE 1100x1100', 'Proyectante', 66066, 1100, 1100, NOW(), NOW()),
('PROYECTANTE 1100x950', 'Proyectante', 66066, 1100, 950, NOW(), NOW()),
('PROYECTANTE 700x950', 'Proyectante', 66066, 700, 950, NOW(), NOW()),
('PROYECTANTE 600x600', 'Proyectante', 45000, 600, 600, NOW(), NOW()),
('PROYECTANTE 400x600', 'Proyectante', 30000, 400, 600, NOW(), NOW()),
('PROYECTANTE 300x300', 'Proyectante', 20000, 300, 300, NOW(), NOW()),

-- INSERTAR PERFILES - PUERTA
('PUERTA 900x2200', 'Puerta', 138135, 900, 2200, NOW(), NOW()),
('PUERTA DOBLE 1800x2200', 'Puerta Doble', 138135, 1800, 2200, NOW(), NOW()),

-- INSERTAR PERFILES - ELEMENTO ESPECIAL
('ELEMENTO ESPECIAL 1000x1000', 'Elemento Especial', 138135, 1000, 1000, NOW(), NOW());
