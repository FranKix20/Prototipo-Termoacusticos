import { HistorialCotizaciones } from "@/components/historial-cotizaciones"

export default function HistorialPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Historial de Cotizaciones</h1>
        <p className="text-muted-foreground">Ver y administrar todas las cotizaciones realizadas</p>
      </div>

      <HistorialCotizaciones />
    </div>
  )
}
