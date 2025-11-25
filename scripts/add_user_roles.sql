-- Adding role column to usuarios table
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS rol VARCHAR(20) DEFAULT 'usuario';

-- Update existing users to be administrators
UPDATE usuarios SET rol = 'administrador' WHERE rol IS NULL OR rol = 'usuario';

-- Create index for faster role-based queries
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON usuarios(rol);
