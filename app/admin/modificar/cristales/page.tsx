"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import type { Cristal } from "@/lib/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ModificarCristalesPage() {
  const [cristales, setCristales] = useState<Cristal[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchCristales()
  }, [])

  const fetchCristales = async () => {
    try {
      const res = await fetch("/api/cristales")
      const { data } = await res.json()
      setCristales(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching cristales:", error)
      toast({ title: "Error", description: "No se pudieron cargar los cristales", variant: "destructive" })
      setLoading(false)
    }
  }

  const handleEdit = async (cristal: Cristal, field: keyof Cristal, value: any) => {
    try {
      const res = await fetch("/api/cristales", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: cristal.id,
          [field]: value,
        }),
      })

      if (!res.ok) throw new Error("Failed to update")

      const { data } = await res.json()
      setCristales(data)
      toast({ title: "Éxito", description: "Cristal actualizado correctamente" })
    } catch (error) {
      console.error("Error updating cristal:", error)
      toast({ title: "Error", description: "No se pudo actualizar el cristal", variant: "destructive" })
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar este cristal?")) {
      try {
        const res = await fetch("/api/cristales", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        })

        if (!res.ok) throw new Error("Failed to delete")

        const { data } = await res.json()
        setCristales(data)
        toast({ title: "Éxito", description: "Cristal eliminado correctamente" })
      } catch (error) {
        console.error("Error deleting cristal:", error)
        toast({ title: "Error", description: "No se pudo eliminar el cristal", variant: "destructive" })
      }
    }
  }

  const handleAdd = async () => {
    try {
      const res = await fetch("/api/cristales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          descripcion: "Nuevo Cristal",
          precio: 0,
        }),
      })

      if (!res.ok) throw new Error("Failed to add")

      const { data } = await res.json()
      setCristales(data)
      toast({ title: "Éxito", description: "Cristal agregado correctamente" })
    } catch (error) {
      console.error("Error adding cristal:", error)
      toast({ title: "Error", description: "No se pudo agregar el cristal", variant: "destructive" })
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
        <span>Cristales</span>
      </div>

      <div className="overflow-x-auto border border-border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead>ID</TableHead>
              <TableHead>Descripción Cristal</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cristales.map((cristal) => (
              <TableRow key={cristal.id}>
                <TableCell className="font-medium">{cristal.id}</TableCell>
                <TableCell>
                  <Input
                    value={cristal.descripcion || ""}
                    onChange={(e) => handleEdit(cristal, "descripcion", e.target.value)}
                    className="w-96 h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={cristal.precio || 0}
                    onChange={(e) => handleEdit(cristal, "precio", Number.parseFloat(e.target.value) || 0)}
                    className="w-24 h-8"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(cristal.id)}
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
        Agregar Cristal
      </Button>
    </div>
  )
}
