-- Insertar datos iniciales de materiales
INSERT INTO materiales (nombre, texto_libre_pdf, texto1, texto2) VALUES
('ALUMINIO PREMIUM XELENTIA', 'ALUMINIO PREMIUM XELENTIA® ALTA CALIDAD CON TERMOPANEL TECNOLOGIA WARM EDGE CON GAS ARGÓN', 'Profil Premium', 'Gas Argón incluido'),
('PVC', 'PVC EUROPEO TOP DE LINEA ALTA CALIDAD CON TERMOPANEL TECNOLOGIA WARM EDGE CON GAS ARGÓN', 'Tecnología Europea', 'Gas Argón'),
('ALUMINIO ESTANDAR', 'ALUMINIO LINEA ESTANDAR CON TERMOPANEL TRADICIONAL CALIDAD INTERMEDIA CON AIRE SECO', 'Línea Estándar', 'Aire Seco');

-- Insertar datos iniciales de cristales
INSERT INTO cristales (descripcion, precio) VALUES
('4+10+4mm Termopanel', 38000),
('5+10+5mm Termopanel', 45000),
('4+10+6', 48000),
('4+10+6 Lam', 60000),
('4+12+4', 38000),
('4+10+4 C.Solar', 60000),
('4+12+4 C.Solar', 60000),
('5 mm', 25000),
('4 mm', 23000),
('6 mm', 27000),
('6 mm Lam', 38000),
('8 mm Lam', 45000),
('8 mm', 32000),
('10 mm', 38000);

-- Insertar datos iniciales de colores
INSERT INTO colores (nombre) VALUES
('NOGAL'),
('TITANIO'),
('MATE'),
('BLANCO'),
('ANTRACITA'),
('ROBLE DORADO'),
('NEGRO');

-- Insertar datos iniciales de tipos
INSERT INTO tipos (descripcion, material_id, ancho, alto, cantidad_cristal, porcentaje_quincalleria, largo_perfiles, minimo, maximo, ganancia) VALUES
('VENTANA CORREDERA CHICA CLASE A', 1, '(X/2)-65', 'Y-124', '2*Z', 0, 1700, 0, 1700, 175),
('VENTANA CORREDERA GRANDE CLASE A', 1, '(X/2)-65', 'Y-124', '2*7', 0, 1700, 1700, 2400, 155),
('VENTANA PAÑO FIJO CLASE A', 1, 'X-64', 'Y-64', 'Z', 0, 0, 0, 0, 125);

-- Insertar datos iniciales de perfiles
INSERT INTO perfiles (nombre, descripcion, grosor) VALUES
('Perfil Clase A', 'Perfil de aluminio premium con aislamiento superior', 70),
('Perfil Clase B', 'Perfil estándar con buen aislamiento', 60);

-- Insertar datos iniciales de quincalleria
INSERT INTO quincalleria (nombre, descripcion, precio) VALUES
('Bisagra Premium', 'Bisagra de acero galvanizado alta calidad', 15000),
('Cerradura de Seguridad', 'Cerradura de 3 puntos', 25000),
('Manija Ergonómica', 'Manija diseño moderno', 8000);
