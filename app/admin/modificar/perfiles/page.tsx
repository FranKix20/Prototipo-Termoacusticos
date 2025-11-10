"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import type { Perfil } from "@/lib/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ModificarPerfilesPage() {
  const [perfiles, setPerfiles] = useState<Perfil[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchPerfiles()
  }, [])

  const fetchPerfiles = async () => {
    try {
      console.log("[v0] Fetching perfiles...")
      const res = await fetch("/api/perfiles")
      const { data } = await res.json()
      console.log("[v0] Perfiles fetched:", data)
      setPerfiles(data)
      setLoading(false)
    } catch (error) {
      console.error("[v0] Error fetching perfiles:", error)
      toast({ title: "Error", description: "No se pudieron cargar los perfiles", variant: "destructive" })
      setLoading(false)
    }
  }

  const handleEdit = async (perfil: Perfil, field: keyof Perfil, value: any) => {
    try {
      console.log("[v0] Editing perfil field:", field, "with value:", value)

      const res = await fetch("/api/perfiles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: perfil.id,
          [field]: value,
        }),
      })

      if (!res.ok) throw new Error("Failed to update")

      const { data } = await res.json()
      setPerfiles(data)
      toast({ title: "Éxito", description: "Perfil actualizado correctamente" })
    } catch (error) {
      console.error("[v0] Error updating perfil:", error)
      toast({ title: "Error", description: "No se pudo actualizar el perfil", variant: "destructive" })
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar este perfil?")) {
      try {
        console.log("[v0] Deleting perfil with id:", id)
        const res = await fetch("/api/perfiles", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        })

        if (!res.ok) throw new Error("Failed to delete")

        const { data } = await res.json()
        setPerfiles(data)
        toast({ title: "Éxito", description: "Perfil eliminado correctamente" })
      } catch (error) {
        console.error("[v0] Error deleting perfil:", error)
        toast({ title: "Error", description: "No se pudo eliminar el perfil", variant: "destructive" })
      }
    }
  }

  const handleAdd = async () => {
    try {
      console.log("[v0] Adding new perfil...")
      const res = await fetch("/api/perfiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: "Nuevo Perfil",
          descripcion: "Descripción del perfil",
          grosor: 70,
        }),
      })

      if (!res.ok) throw new Error("Failed to add")

      const { data } = await res.json()
      setPerfiles(data)
      toast({ title: "Éxito", description: "Perfil agregado correctamente" })
    } catch (error) {
      console.error("[v0] Error adding perfil:", error)
      toast({ title: "Error", description: "No se pudo agregar el perfil", variant: "destructive" })
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
        <span>Perfiles</span>
      </div>

      <div className="overflow-x-auto border border-border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead>ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Grosor (mm)</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {perfiles.map((perfil) => (
              <TableRow key={perfil.id}>
                <TableCell className="font-medium">{perfil.id}</TableCell>
                <TableCell>
                  <Input
                    value={perfil.nombre || ""}
                    onChange={(e) => handleEdit(perfil, "nombre", e.target.value)}
                    className="w-40 h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={perfil.descripcion || ""}
                    onChange={(e) => handleEdit(perfil, "descripcion", e.target.value)}
                    className="w-80 h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={perfil.grosor || 0}
                    onChange={(e) => handleEdit(perfil, "grosor", Number.parseInt(e.target.value) || 0)}
                    className="w-24 h-8"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(perfil.id)}
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
        Agregar Perfil
      </Button>
    </div>
  )
}
