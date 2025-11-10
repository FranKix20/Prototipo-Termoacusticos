"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import type { Quincalleria } from "@/lib/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ModificarQuincalleriaPage() {
  const [quincallerias, setQuincallerias] = useState<Quincalleria[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchQuincallerias()
  }, [])

  const fetchQuincallerias = async () => {
    try {
      console.log("[v0] Fetching quincallerias...")
      const res = await fetch("/api/quincalleria")
      const { data } = await res.json()
      console.log("[v0] Quincallerias fetched:", data)
      setQuincallerias(data)
      setLoading(false)
    } catch (error) {
      console.error("[v0] Error fetching quincallerias:", error)
      toast({ title: "Error", description: "No se pudieron cargar las quincallerías", variant: "destructive" })
      setLoading(false)
    }
  }

  const handleEdit = async (item: Quincalleria, field: keyof Quincalleria, value: any) => {
    try {
      console.log("[v0] Editing quincalleria field:", field, "with value:", value)

      const res = await fetch("/api/quincalleria", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: item.id,
          [field]: value,
        }),
      })

      if (!res.ok) throw new Error("Failed to update")

      const { data } = await res.json()
      setQuincallerias(data)
      toast({ title: "Éxito", description: "Quincallería actualizada correctamente" })
    } catch (error) {
      console.error("[v0] Error updating quincalleria:", error)
      toast({ title: "Error", description: "No se pudo actualizar la quincallería", variant: "destructive" })
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta quincallería?")) {
      try {
        console.log("[v0] Deleting quincalleria with id:", id)
        const res = await fetch("/api/quincalleria", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        })

        if (!res.ok) throw new Error("Failed to delete")

        const { data } = await res.json()
        setQuincallerias(data)
        toast({ title: "Éxito", description: "Quincallería eliminada correctamente" })
      } catch (error) {
        console.error("[v0] Error deleting quincalleria:", error)
        toast({ title: "Error", description: "No se pudo eliminar la quincallería", variant: "destructive" })
      }
    }
  }

  const handleAdd = async () => {
    try {
      console.log("[v0] Adding new quincalleria...")
      const res = await fetch("/api/quincalleria", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: "Nueva Quincallería",
          descripcion: "Descripción",
          precio: 10000,
        }),
      })

      if (!res.ok) throw new Error("Failed to add")

      const { data } = await res.json()
      setQuincallerias(data)
      toast({ title: "Éxito", description: "Quincallería agregada correctamente" })
    } catch (error) {
      console.error("[v0] Error adding quincalleria:", error)
      toast({ title: "Error", description: "No se pudo agregar la quincallería", variant: "destructive" })
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
        <span>Quincallería</span>
      </div>

      <div className="overflow-x-auto border border-border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead>ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quincallerias.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>
                  <Input
                    value={item.nombre || ""}
                    onChange={(e) => handleEdit(item, "nombre", e.target.value)}
                    className="w-40 h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={item.descripcion || ""}
                    onChange={(e) => handleEdit(item, "descripcion", e.target.value)}
                    className="w-80 h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={item.precio || 0}
                    onChange={(e) => handleEdit(item, "precio", Number.parseInt(e.target.value) || 0)}
                    className="w-24 h-8"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
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
        Agregar Quincallería
      </Button>
    </div>
  )
}
