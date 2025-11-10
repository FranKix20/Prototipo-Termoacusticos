import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <span className="font-sans text-xl font-bold text-primary-foreground">TP</span>
          </div>
          <span className="font-sans text-xl font-semibold text-foreground">TermoPro</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/" className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground">
            Inicio
          </Link>
          <Link
            href="/productos"
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
          >
            Productos
          </Link>
          <Link
            href="/cotizacion"
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
          >
            Cotización
          </Link>
          <Link
            href="/contacto"
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
          >
            Contacto
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button asChild className="hidden md:inline-flex">
            <Link href="/cotizacion">Cotizar Ahora</Link>
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
