"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import type { Color } from "@/lib/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ModificarColoresPage() {
  const [colores, setColores] = useState<Color[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchColores()
  }, [])

  const fetchColores = async () => {
    try {
      console.log("[v0] Fetching colores...")
      const res = await fetch("/api/colores")
      const { data } = await res.json()
      console.log("[v0] Colores fetched:", data)
      setColores(data)
      setLoading(false)
    } catch (error) {
      console.error("[v0] Error fetching colores:", error)
      toast({ title: "Error", description: "No se pudieron cargar los colores", variant: "destructive" })
      setLoading(false)
    }
  }

  const handleEdit = async (color: Color, field: keyof Color, value: any) => {
    try {
      console.log("[v0] Editing color field:", field, "with value:", value)

      const res = await fetch("/api/colores", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: color.id,
          [field]: value,
        }),
      })

      if (!res.ok) throw new Error("Failed to update")

      const { data } = await res.json()
      setColores(data)
      toast({ title: "Éxito", description: "Color actualizado correctamente" })
    } catch (error) {
      console.error("[v0] Error updating color:", error)
      toast({ title: "Error", description: "No se pudo actualizar el color", variant: "destructive" })
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar este color?")) {
      try {
        console.log("[v0] Deleting color with id:", id)
        const res = await fetch("/api/colores", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        })

        if (!res.ok) throw new Error("Failed to delete")

        const { data } = await res.json()
        setColores(data)
        toast({ title: "Éxito", description: "Color eliminado correctamente" })
      } catch (error) {
        console.error("[v0] Error deleting color:", error)
        toast({ title: "Error", description: "No se pudo eliminar el color", variant: "destructive" })
      }
    }
  }

  const handleAdd = async () => {
    try {
      console.log("[v0] Adding new color...")
      const res = await fetch("/api/colores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: "Nuevo Color",
        }),
      })

      if (!res.ok) throw new Error("Failed to add")

      const { data } = await res.json()
      setColores(data)
      toast({ title: "Éxito", description: "Color agregado correctamente" })
    } catch (error) {
      console.error("[v0] Error adding color:", error)
      toast({ title: "Error", description: "No se pudo agregar el color", variant: "destructive" })
    }
  }

  if (loading) {
    return <div className="text-center py-8">Cargando...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link href="/admin" className="hover:text-foreground">
          Home
        </Link>
        <span>›</span>
        <Link href="/admin/modificar" className="hover:text-foreground">
          Modificar
        </Link>
        <span>›</span>
        <span>Colores</span>
      </div>

      <div className="overflow-x-auto border border-border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead>ID</TableHead>
              <TableHead>Nombre Color</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {colores.map((color) => (
              <TableRow key={color.id}>
                <TableCell className="font-medium">{color.id}</TableCell>
                <TableCell>
                  <Input
                    value={color.nombre || ""}
                    onChange={(e) => handleEdit(color, "nombre", e.target.value)}
                    className="w-96 h-8"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(color.id)}
                    className="text-red-600 hover:text-red-700"
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
        Agregar Color
      </Button>
    </div>
  )
}
