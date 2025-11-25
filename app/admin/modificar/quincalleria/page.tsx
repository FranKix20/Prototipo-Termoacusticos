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
      const res = await fetch("/api/quincalleria")
      const { data } = await res.json()
      setQuincallerias(data)
      setLoading(false)
    } catch (error) {
      toast({ title: "Error", description: "No se pudieron cargar las quincallerías", variant: "destructive" })
      setLoading(false)
    }
  }

  const handleEdit = async (item: Quincalleria, field: keyof Quincalleria, value: any) => {
    try {
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
      toast({ title: "Error", description: "No se pudo actualizar la quincallería", variant: "destructive" })
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta quincallería?")) {
      try {
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
        toast({ title: "Error", description: "No se pudo eliminar la quincallería", variant: "destructive" })
      }
    }
  }

  const handleAdd = async () => {
    try {
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
              <TableHead className="w-16">ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead className="w-32">Precio (CLP)</TableHead>
              <TableHead className="w-24">Acciones</TableHead>
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
                    className="w-full h-8"
                    placeholder="Nombre"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={item.descripcion || ""}
                    onChange={(e) => handleEdit(item, "descripcion", e.target.value)}
                    className="w-full h-8"
                    placeholder="Descripción"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={item.precio || ""}
                    onChange={(e) => handleEdit(item, "precio", Number.parseInt(e.target.value) || 0)}
                    onFocus={(e) => e.target.value === "0" && e.target.select()}
                    className="w-full h-8"
                    placeholder="0"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
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
        Agregar Quincallería
      </Button>
    </div>
  )
}
