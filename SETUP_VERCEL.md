# Guía Completa: Configuración en Vercel

## Paso 1: Conectar Supabase a tu Proyecto de Vercel

### 1.1 Crear Proyecto en Supabase (si no lo tienes)
1. Ve a [supabase.com](https://supabase.com)
2. Inicia sesión con GitHub
3. Crea un nuevo proyecto:
   - **Project Name**: termoacusticos
   - **Database Password**: (crea una contraseña fuerte)
   - **Region**: Selecciona la más cercana a tu ubicación
4. Espera a que el proyecto se inicialice (5-10 minutos)

### 1.2 Ejecutar Scripts SQL para Crear Tablas

Una vez que Supabase esté listo:

1. Ve a tu proyecto en Supabase Dashboard
2. Abre **SQL Editor** en el sidebar izquierdo
3. Crea una nueva query
4. Copia todo el contenido de `scripts/001_create_tables.sql` y pégalo en el editor
5. Haz clic en **"Run"** para ejecutar
6. Luego, copia el contenido de `scripts/002_seed_initial_data.sql` y ejecútalo también

**Esto creará todas las tablas y las poblará con datos iniciales.**

### 1.3 Obtener las Credenciales de Supabase

1. En Supabase Dashboard, haz clic en **"Settings"** en el sidebar izquierdo
2. Selecciona **"API"** en el submenu
3. Copia estas variables:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon Key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 1.4 Conectar Supabase con Vercel

#### Opción A: Desde Vercel Dashboard (Recomendado)

1. Ve a [vercel.com/dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **Settings** → **Integrations**
4. Busca **"Supabase"** en el marketplace
5. Haz clic en **"Add"**
6. Autoriza la conexión
7. Selecciona tu proyecto de Supabase
8. Vercel automáticamente agregará las variables de entorno

#### Opción B: Manual (si la integración no funciona)

1. Ve a **Settings** → **Environment Variables** en tu proyecto de Vercel
2. Agrega estas variables:
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
   \`\`\`
3. Haz clic en **"Save"**
4. Redeploy tu proyecto

## Paso 2: Desplegar a Vercel

### 2.1 Desde la Línea de Comandos (Recomendado)

\`\`\`bash
# Instala Vercel CLI si no lo tienes
npm install -g vercel

# Desde la carpeta de tu proyecto
vercel
\`\`\`

Sigue las instrucciones interactivas para:
1. Seleccionar scope
2. Confirmar nombre del proyecto
3. Seleccionar framework (Next.js)
4. Configurar directorio de build

### 2.2 Desde GitHub (Automático)

1. Sube tu proyecto a GitHub
2. Ve a [vercel.com/dashboard](https://vercel.com/dashboard)
3. Haz clic en **"Add New"** → **"Project"**
4. Selecciona tu repositorio de GitHub
5. Haz clic en **"Import"**
6. Vercel automáticamente detectará Next.js
7. Agrega las variables de entorno de Supabase (ver Paso 1.4)
8. Haz clic en **"Deploy"**

## Paso 3: Verificar que Todo Funciona

Después de deployar:

1. Abre tu sitio en Vercel (verá una URL como: `https://tu-proyecto.vercel.app`)
2. Ve a `/admin/modificar/tipos`
3. Prueba agregar, editar y eliminar un tipo
4. Los cambios deben reflejarse en tiempo real desde la base de datos de Supabase
5. Ve a `/admin/cotizar` y prueba generar un PDF

## Paso 4: Monitorear y Hacer Cambios

### Hacer Cambios en la Base de Datos

Si necesitas modificar la estructura de la base de datos:

1. Ve a tu proyecto en Supabase Dashboard
2. Abre **SQL Editor**
3. Realiza tus cambios (ej: agregar columnas, cambiar tipos de datos)
4. Ejecuta la query
5. Los cambios se reflejarán automáticamente en tu sitio

### Ver Logs y Errores

En Vercel Dashboard:
1. Selecciona tu proyecto
2. Ve a **Deployments**
3. Selecciona el deployment más reciente
4. Haz clic en **"Logs"** para ver cualquier error

## Paso 5: Configuración Adicional (Opcional)

### Domain Personalizado

1. Ve a **Settings** → **Domains** en tu proyecto de Vercel
2. Haz clic en **"Add"**
3. Ingresa tu dominio (ej: termoacusticos.com)
4. Sigue las instrucciones para configurar tus DNS records

### Variables de Entorno Diferentes por Entorno

Puedes tener variables diferentes para Staging y Producción:

1. Ve a **Settings** → **Environment Variables**
2. Para cada variable, selecciona en qué ambientes aplicará (Preview, Production, Development)
3. Ejemplo: Usar una base de datos de Supabase diferente para desarrollo y producción

## Troubleshooting

### "Failed to fetch tipos" / Base de datos vacía

**Solución:**
1. Asegúrate de haber ejecutado los scripts SQL 001 y 002
2. Verifica que las variables de entorno están correctamente configuradas en Vercel
3. Redeploy: haz clic en **"Redeploy"** desde Deployments

### Las variables de entorno no se cargan

**Solución:**
1. Verifica que el nombre exacto de las variables sea:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
2. Asegúrate de que comenzar con `NEXT_PUBLIC_` (para variables que se usan en el cliente)
3. Redeploy después de cambiar variables

### Errores de CORS

Si ves errores de CORS en la consola del navegador:

1. Ve a Supabase Dashboard → **Settings** → **API**
2. Desplázate a la sección **CORS**
3. Agrega tu dominio de Vercel: `https://tu-proyecto.vercel.app`

### Cambios en la base de datos no se reflejan

**Solución:**
1. Borra el cache del navegador (Ctrl+Shift+Delete)
2. Abre DevTools (F12)
3. Ve a **Network** y marca "Disable cache"
4. Recarga la página
5. Si sigue sin funcionar, redeploy desde Vercel

## Próximos Pasos

1. **Agregar Autenticación**: Puedes implementar login con Supabase Auth si lo necesitas
2. **Backups**: Configura backups automáticos en Supabase Dashboard
3. **Monitoreo**: Usa Vercel Analytics para monitorear rendimiento
4. **Seguridad**: Activa Row Level Security (RLS) en Supabase para proteger datos

## Estructura de Carpetas después de Desplegar

\`\`\`
Tu Proyecto Vercel
├── Base de datos: Supabase (alojada en la nube)
├── Backend: Vercel (API routes en /app/api/)
├── Frontend: Vercel (componentes React)
└── Assets: Vercel (imágenes y archivos estáticos)
\`\`\`

Todo está sincronizado automáticamente en la nube. ¡Listo para producción!
