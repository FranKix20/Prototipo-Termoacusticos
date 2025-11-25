"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ correo: email, contraseña: password }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem("admin_authenticated", "true")
        localStorage.setItem("admin_usuario_id", data.usuario.id.toString())
        localStorage.setItem("admin_email", data.usuario.correo)
        localStorage.setItem("admin_nombre", data.usuario.nombre)
        localStorage.setItem("admin_rol", data.usuario.rol)
        router.push("/admin")
      } else {
        setError(data.error || "Error al iniciar sesión")
        setPassword("")
      }
    } catch (err) {
      console.error("[v0] Error de login:", err)
      setError("Error de conexión. Intenta de nuevo.")
      setPassword("")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-600 to-teal-700 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-t-lg">
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-white/20 mx-auto mb-4">
            <div>
              <div className="font-bold text-2xl text-white">TERMO</div>
              <div className="font-bold text-lg text-yellow-300">ACÚSTICOS</div>
            </div>
          </div>
          <CardTitle className="text-2xl">Acceso al Sistema</CardTitle>
          <CardDescription className="text-white/80">Ingresa tus credenciales para acceder</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Email</label>
              <Input
                type="email"
                placeholder="usuario@termoacusticos.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Contraseña</label>
              <Input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                autoFocus
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
            <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" disabled={isLoading}>
              {isLoading ? "Ingresando..." : "Ingresar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
