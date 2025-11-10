"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { CotizacionForm, type CotizacionData } from "@/components/cotizacion-form"
import { CotizacionResultado } from "@/components/cotizacion-resultado"
import { calcularCotizacion } from "@/lib/cotizacion-calculator"

export default function CotizacionPage() {
  const [resultado, setResultado] = useState<ReturnType<typeof calcularCotizacion> | null>(null)
  const [dataCotizacion, setDataCotizacion] = useState<CotizacionData | null>(null)

  const handleCotizar = (data: CotizacionData) => {
    const calculoResultado = calcularCotizacion(data)
    setResultado(calculoResultado)
    setDataCotizacion(data)
  }

  const handleNuevaCotizacion = () => {
    setResultado(null)
    setDataCotizacion(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="mb-4 font-sans text-4xl font-bold text-foreground text-balance md:text-5xl">
            Cotización de Termopaneles
          </h1>
          <p className="text-lg text-muted-foreground text-pretty">
            Completa el formulario y obtén tu cotización personalizada al instante
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          {!resultado || !dataCotizacion ? (
            <CotizacionForm onCotizar={handleCotizar} />
          ) : (
            <CotizacionResultado
              data={dataCotizacion}
              resultado={resultado}
              onNuevaCotizacion={handleNuevaCotizacion}
            />
          )}
        </div>
      </main>
    </div>
  )
}
