# CONFIGURACIÓN COMPLETA: SUPABASE + VERCEL

## RESUMEN RÁPIDO

Tu aplicación ahora usa **Supabase** (base de datos en la nube) en lugar de guardar datos en memoria. Esto significa:

✅ Los datos persisten permanentemente  
✅ Funciona en múltiples servidores simultáneamente  
✅ Los cambios se ven en tiempo real  
✅ Listo para producción  

---

## PASO 1: PREPARAR SUPABASE

### 1.1 Crear Proyecto Supabase

1. Ve a **supabase.com** y crea una cuenta
2. Haz clic en **"New Project"**
3. Completa los datos:
   - **Organization**: Crea una nueva
   - **Project name**: `termoacusticos`
   - **Database Password**: (crea una fuerte)
   - **Region**: Elige la más cercana a ti
4. Espera 5-10 minutos a que se inicialice

### 1.2 Ejecutar Scripts SQL

**Importante**: Esto crea las tablas y datos iniciales

1. En Supabase, abre **SQL Editor** (sidebar izquierdo)
2. Crea una nueva query vacía
3. Copia TODO el contenido de: `scripts/001_create_tables.sql`
4. Pégalo en el editor y haz clic en **"Run"**
5. Espera a que termine (verde = éxito)
6. Repite lo mismo con: `scripts/002_seed_initial_data.sql`

Si ves errores, es porque el script ya se ejecutó (no hay problema).

### 1.3 Obtener Credenciales

1. En Supabase, ve a **Settings** → **API** (sidebar)
2. Copia estos valores:
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL = (copia "Project URL")
   NEXT_PUBLIC_SUPABASE_ANON_KEY = (copia "anon key")
   \`\`\`
3. Guarda estos valores en un bloc de notas (los necesitarás en Vercel)

---

## PASO 2: DESPLEGAR EN VERCEL

### 2.1 Si tu código está en GitHub

1. Ve a **vercel.com/dashboard**
2. Haz clic en **"Add New"** → **"Project"**
3. Conecta tu repositorio de GitHub
4. Haz clic en **"Import"**

### 2.2 Si no tienes GitHub

1. Instala Vercel CLI:
   \`\`\`bash
   npm install -g vercel
   \`\`\`
2. En tu carpeta del proyecto, ejecuta:
   \`\`\`bash
   vercel
   \`\`\`
3. Sigue las instrucciones interactivas

### 2.3 Agregar Variables de Entorno

En Vercel Dashboard:

1. Selecciona tu proyecto
2. Ve a **Settings** → **Environment Variables**
3. Agrega estas 2 variables:

   | Nombre | Valor |
   |--------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | (copia de Supabase) |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (copia de Supabase) |

4. Haz clic en **"Save"**
5. Ve a **Deployments** y haz clic en **"Redeploy"** del último deployment

**Espera 2-3 minutos** a que termine el redeploy

---

## PASO 3: VERIFICAR QUE FUNCIONA

1. Abre tu sitio: `https://tu-proyecto.vercel.app`
2. Ve a `/admin/modificar/tipos`
3. Prueba:
   - ✅ Editar un tipo
   - ✅ Agregar uno nuevo
   - ✅ Eliminar uno
4. Actualiza la página (F5) - **los cambios deben seguir ahí**
5. Ve a `/admin/cotizar` y genera un PDF

Si todo funciona = **¡Configuración exitosa!**

---

## PASO 4: CAMBIOS EN LA BASE DE DATOS

Si necesitas agregar o modificar algo en la base de datos:

### Para Agregar Datos Nuevos

En Supabase Dashboard:
1. Ve a **SQL Editor**
2. Escribe tu consulta SQL
3. Ejecuta

Ejemplo - agregar un nuevo color:
\`\`\`sql
INSERT INTO colores (nombre) VALUES ('ROJO');
\`\`\`

### Para Modificar Estructura

En Supabase Dashboard:
1. Ve a **SQL Editor**
2. Modifica las tablas

Ejemplo - agregar columna:
\`\`\`sql
ALTER TABLE tipos ADD COLUMN nueva_columna TEXT;
\`\`\`

---

## TROUBLESHOOTING

### ❌ "Failed to fetch tipos" en la app

**Solución:**
1. Verifica que ejecutaste los 2 scripts SQL (001 y 002)
2. Verifica que las variables en Vercel están correctas
3. Copia exactamente las variables de Supabase (sin espacios)
4. En Vercel, haz clic en **Redeploy**

### ❌ Variables de entorno no funcionan

**Solución:**
1. Los nombres deben ser exactos:
   - `NEXT_PUBLIC_SUPABASE_URL` ← sin tildes ni espacios
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` ← sin tildes ni espacios
2. Deben empezar con `NEXT_PUBLIC_` (para que funcionen en el cliente)
3. Después de cambiar variables = **SIEMPRE REDEPLOY**

### ❌ Veo un error en Vercel Deployments

1. En Vercel Dashboard, abre **Deployments**
2. Selecciona el último deployment
3. Ve a **"Logs"** y busca el error rojo
4. Lee el error (generalmente dice qué falta)
5. Arregla y haz redeploy

### ❌ Los cambios no aparecen en la app

**Solución:**
1. Borra el cache del navegador: **Ctrl+Shift+Delete**
2. Abre DevTools: **F12** → **Network** → marca "Disable cache"
3. Recarga la página: **F5**
4. Si sigue sin funcionar, haz **Redeploy** en Vercel

---

## ESTRUCTURA FINAL

\`\`\`
Supabase (Nube)
    ↓ (datos)
Vercel Backend (API routes en /app/api/)
    ↓ (JSON)
Vercel Frontend (React en /app/)
    ↓ (HTML)
Navegador del Usuario
\`\`\`

Todo está alojado en la nube. Los usuarios acceden por:
**https://tu-proyecto.vercel.app**

---

## PRÓXIMAS CARACTERÍSTICAS (Opcional)

- Autenticación de usuarios
- Historial de cotizaciones
- Reportes y estadísticas
- Notificaciones por email
- Backups automáticos

---

## CONTACTO / SOPORTE

Si tienes problemas:
1. Verifica el archivo de logs en Vercel (Deployments → Logs)
2. Revisa que Supabase está online (supabase.com dashboard)
3. Comprueba que las variables están exactas (sin espacios, tildes)

¡Lista tu aplicación para producción!
