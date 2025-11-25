"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import type { Tipo } from "@/lib/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ModificarTiposPage() {
  const [tipos, setTipos] = useState<Tipo[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchTipos()
  }, [])

  const fetchTipos = async () => {
    try {
      console.log("[v0] Fetching tipos...")
      const res = await fetch("/api/tipos")
      const { data } = await res.json()
      console.log("[v0] Tipos fetched:", data)
      setTipos(data)
      setLoading(false)
    } catch (error) {
      console.error("[v0] Error fetching tipos:", error)
      toast({ title: "Error", description: "No se pudieron cargar los tipos", variant: "destructive" })
      setLoading(false)
    }
  }

  const handleEdit = async (tipo: Tipo, field: keyof Tipo, value: any) => {
    try {
      const res = await fetch("/api/tipos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: tipo.id,
          [field]: value,
        }),
      })

      if (!res.ok) throw new Error("Failed to update")

      const { data } = await res.json()
      setTipos(data)
      toast({ title: "Éxito", description: "Tipo actualizado correctamente" })
    } catch (error) {
      console.error("[v0] Error updating tipo:", error)
      toast({ title: "Error", description: "No se pudo actualizar el tipo", variant: "destructive" })
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar este tipo?")) {
      try {
        const res = await fetch("/api/tipos", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        })

        if (!res.ok) throw new Error("Failed to delete")

        const { data } = await res.json()
        setTipos(data)
        toast({ title: "Éxito", description: "Tipo eliminado correctamente" })
      } catch (error) {
        console.error("[v0] Error deleting tipo:", error)
        toast({ title: "Error", description: "No se pudo eliminar el tipo", variant: "destructive" })
      }
    }
  }

  const handleAdd = async () => {
    try {
      const res = await fetch("/api/tipos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          descripcion: "Nuevo Tipo de Ventana",
          precio_por_m2: 100000,
        }),
      })

      if (!res.ok) throw new Error("Failed to add")

      const { data } = await res.json()
      setTipos(data)
      toast({ title: "Éxito", description: "Tipo agregado correctamente" })
    } catch (error) {
      console.error("[v0] Error adding tipo:", error)
      toast({ title: "Error", description: "No se pudo agregar el tipo", variant: "destructive" })
    }
  }

  if (loading) {
    return <div className="text-center py-8">Cargando...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/admin" className="hover:text-foreground">
          Home
        </Link>
        <span>›</span>
        <Link href="/admin/modificar" className="hover:text-foreground">
          Modificar
        </Link>
        <span>›</span>
        <span>Tipos</span>
      </div>

      <div className="overflow-x-auto border border-border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="w-16">ID</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead className="w-40">Precio por m² (CLP)</TableHead>
              <TableHead className="w-24">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tipos.map((tipo) => (
              <TableRow key={tipo.id}>
                <TableCell className="font-medium">{tipo.id}</TableCell>
                <TableCell>
                  <Input
                    value={tipo.descripcion}
                    onChange={(e) => handleEdit(tipo, "descripcion", e.target.value)}
                    className="w-full h-8"
                    placeholder="Descripción del tipo"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={tipo.precio_por_m2 || ""}
                    onChange={(e) => handleEdit(tipo, "precio_por_m2", Number.parseInt(e.target.value) || 0)}
                    onFocus={(e) => e.target.value === "0" && e.target.select()}
                    className="w-full h-8"
                    placeholder="0"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(tipo.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Button onClick={handleAdd} className="bg-teal-600 hover:bg-teal-700 text-white w-full">
        <Plus className="w-4 h-4 mr-2" />
        Agregar Tipo
      </Button>
    </div>
  )
}
