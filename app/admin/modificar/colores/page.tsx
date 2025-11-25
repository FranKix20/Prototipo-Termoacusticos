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
      const res = await fetch("/api/colores")
      const { data } = await res.json()
      setColores(data)
      setLoading(false)
    } catch (error) {
      toast({ title: "Error", description: "No se pudieron cargar los colores", variant: "destructive" })
      setLoading(false)
    }
  }

  const handleEdit = async (color: Color, field: keyof Color, value: any) => {
    try {
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
      toast({ title: "Error", description: "No se pudo actualizar el color", variant: "destructive" })
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar este color?")) {
      try {
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
        toast({ title: "Error", description: "No se pudo eliminar el color", variant: "destructive" })
      }
    }
  }

  const handleAdd = async () => {
    try {
      const res = await fetch("/api/colores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: "Nuevo Color",
          precio: 0,
        }),
      })

      if (!res.ok) throw new Error("Failed to add")

      const { data } = await res.json()
      setColores(data)
      toast({ title: "Éxito", description: "Color agregado correctamente" })
    } catch (error) {
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
              <TableHead className="w-16">ID</TableHead>
              <TableHead>Nombre Color</TableHead>
              <TableHead className="w-32">Precio (CLP)</TableHead>
              <TableHead className="w-24">Acciones</TableHead>
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
                    className="w-full h-8"
                    placeholder="Nombre del color"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={color.precio || ""}
                    onChange={(e) => handleEdit(color, "precio", Number.parseInt(e.target.value) || 0)}
                    onFocus={(e) => e.target.value === "0" && e.target.select()}
                    className="w-full h-8"
                    placeholder="0"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(color.id)}
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
        Agregar Color
      </Button>
    </div>
  )
}
