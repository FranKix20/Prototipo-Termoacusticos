"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import type { Material } from "@/lib/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ModificarMaterialesPage() {
  const [materiales, setMateriales] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchMateriales()
  }, [])

  const fetchMateriales = async () => {
    try {
      const res = await fetch("/api/materiales")
      const { data } = await res.json()
      setMateriales(data)
      setLoading(false)
    } catch (error) {
      toast({ title: "Error", description: "No se pudieron cargar los materiales", variant: "destructive" })
      setLoading(false)
    }
  }

  const handleEdit = async (material: Material, field: keyof Material, value: any) => {
    try {
      const fieldMap: Record<string, string> = {
        nombre: "nombre",
        textoLibrePDF: "textoLibrePDF",
        texto1: "texto1",
        texto2: "texto2",
      }

      const res = await fetch("/api/materiales", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: material.id,
          [fieldMap[field] || field]: value,
        }),
      })

      if (!res.ok) throw new Error("Failed to update")

      const { data } = await res.json()
      setMateriales(data)
      toast({ title: "Éxito", description: "Material actualizado correctamente" })
    } catch (error) {
      toast({ title: "Error", description: "No se pudo actualizar el material", variant: "destructive" })
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar este material?")) {
      try {
        const res = await fetch("/api/materiales", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        })

        if (!res.ok) throw new Error("Failed to delete")

        const { data } = await res.json()
        setMateriales(data)
        toast({ title: "Éxito", description: "Material eliminado correctamente" })
      } catch (error) {
        toast({ title: "Error", description: "No se pudo eliminar el material", variant: "destructive" })
      }
    }
  }

  const handleAdd = async () => {
    try {
      const res = await fetch("/api/materiales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: "Nuevo Material",
          textoLibrePDF: "Descripción del material",
          texto1: "Texto 1",
          texto2: "Texto 2",
        }),
      })

      if (!res.ok) throw new Error("Failed to add")

      const { data } = await res.json()
      setMateriales(data)
      toast({ title: "Éxito", description: "Material agregado correctamente" })
    } catch (error) {
      toast({ title: "Error", description: "No se pudo agregar el material", variant: "destructive" })
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
        <span>Materiales</span>
      </div>

      <div className="overflow-x-auto border border-border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="w-16">ID</TableHead>
              <TableHead className="min-w-48">Nombre Material</TableHead>
              <TableHead className="min-w-96">Texto Libre PDF</TableHead>
              <TableHead className="min-w-40">Texto 1</TableHead>
              <TableHead className="min-w-40">Texto 2</TableHead>
              <TableHead className="w-24">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {materiales.map((material) => (
              <TableRow key={material.id}>
                <TableCell className="font-medium">{material.id}</TableCell>
                <TableCell>
                  <Input
                    value={material.nombre || ""}
                    onChange={(e) => handleEdit(material, "nombre", e.target.value)}
                    className="w-full h-8 min-w-44"
                    placeholder="Nombre"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={material.textoLibrePDF || ""}
                    onChange={(e) => handleEdit(material, "textoLibrePDF", e.target.value)}
                    className="w-full h-8 min-w-80"
                    placeholder="Descripción para PDF"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={material.texto1 || ""}
                    onChange={(e) => handleEdit(material, "texto1", e.target.value)}
                    className="w-full h-8 min-w-36"
                    placeholder="Texto 1"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={material.texto2 || ""}
                    onChange={(e) => handleEdit(material, "texto2", e.target.value)}
                    className="w-full h-8 min-w-36"
                    placeholder="Texto 2"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(material.id)}
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
        Agregar Material
      </Button>
    </div>
  )
}
