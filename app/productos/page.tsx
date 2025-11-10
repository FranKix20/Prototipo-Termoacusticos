import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TIPOS_VENTANAS, MATERIALES_MARCO, TIPOS_VIDRIO } from "@/lib/productos-database"
import { formatCurrency } from "@/lib/cotizacion-calculator"
import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"

export default function ProductosPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-4 font-sans text-4xl font-bold text-foreground text-balance md:text-5xl">
            Nuestros Productos
          </h1>
          <p className="text-lg text-muted-foreground text-pretty">
            Catálogo completo de termopaneles con especificaciones técnicas y precios
          </p>
        </div>

        {/* Tipos de Ventanas */}
        <section className="mb-16">
          <h2 className="mb-6 font-sans text-3xl font-bold text-foreground">Tipos de Ventanas</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {TIPOS_VENTANAS.map((producto) => (
              <Card key={producto.id} className="border-border bg-card transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-card-foreground">{producto.nombre}</CardTitle>
                      <CardDescription>{producto.descripcion}</CardDescription>
                    </div>
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      Desde {formatCurrency(producto.precioBaseM2)}/m²
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {producto.caracteristicas.map((caracteristica, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                        <span>{caracteristica}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Materiales de Marco */}
        <section className="mb-16">
          <h2 className="mb-6 font-sans text-3xl font-bold text-foreground">Materiales de Marco</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {MATERIALES_MARCO.map((material) => (
              <Card key={material.id} className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-card-foreground">{material.nombre}</CardTitle>
                  <CardDescription>{material.descripcion}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {material.caracteristicas.map((caracteristica, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                        <span>{caracteristica}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Tipos de Vidrio */}
        <section className="mb-16">
          <h2 className="mb-6 font-sans text-3xl font-bold text-foreground">Tipos de Vidrio</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {TIPOS_VIDRIO.map((vidrio) => (
              <Card key={vidrio.id} className="border-border bg-card">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-card-foreground">{vidrio.nombre}</CardTitle>
                      <CardDescription>{vidrio.descripcion}</CardDescription>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Badge variant="outline" className="font-mono text-xs">
                      {vidrio.grosor}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {vidrio.caracteristicas.map((caracteristica, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                        <span>{caracteristica}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-lg border border-border bg-primary p-8 text-center text-primary-foreground">
          <h2 className="mb-4 font-sans text-3xl font-bold">¿Listo para cotizar?</h2>
          <p className="mb-6 text-lg text-primary-foreground/90">
            Obtén tu cotización personalizada con precios actualizados
          </p>
          <Button asChild size="lg" variant="secondary" className="gap-2">
            <Link href="/cotizacion">
              Cotizar Ahora
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </section>
      </main>
    </div>
  )
}
