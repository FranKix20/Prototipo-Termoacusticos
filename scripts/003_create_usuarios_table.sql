-- Crear tabla de usuarios en Supabase
CREATE TABLE IF NOT EXISTS usuarios (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nombre TEXT NOT NULL,
  correo TEXT NOT NULL UNIQUE,
  contraseña TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar usuario admin por defecto
INSERT INTO usuarios (nombre, correo, contraseña) 
VALUES ('Administrador', 'admin@termoacusticos.com', 'admin123')
ON CONFLICT (correo) DO NOTHING;

-- Crear índice en correo para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_usuarios_correo ON usuarios(correo);
