import { GestionUsuarios } from "@/components/gestion-usuarios"

export default function ConfiguracionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Configuración</h1>
        <p className="text-muted-foreground">Administra usuarios y parámetros del sistema</p>
      </div>

      <GestionUsuarios />
    </div>
  )
}
