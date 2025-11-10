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
  const [editingId, setEditingId] = useState<number | null>(null)
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
      const fieldMap: Record<string, string> = {
        descripcion: "descripcion",
        materialId: "materialId",
        ancho: "ancho",
        alto: "alto",
        cantidadCristal: "cantidadCristal",
        porcentajeQuincalleria: "porcentajeQuincalleria",
        largoPerfiles: "largoPerfiles",
        minimo: "minimo",
        maximo: "maximo",
        ganancia: "ganancia",
      }

      const res = await fetch("/api/tipos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: tipo.id,
          [fieldMap[field] || field]: value,
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
          descripcion: "Nueva Ventana",
          materialId: 1,
          ancho: "X",
          alto: "Y",
          cantidadCristal: "Z",
          porcentajeQuincalleria: 0,
          largoPerfiles: 0,
          minimo: 0,
          maximo: 0,
          ganancia: 0,
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
              <TableHead>ID</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Material</TableHead>
              <TableHead>Ancho</TableHead>
              <TableHead>Alto</TableHead>
              <TableHead>Cristal</TableHead>
              <TableHead>% Quincallería</TableHead>
              <TableHead>Largo Perfil</TableHead>
              <TableHead>Mínimo</TableHead>
              <TableHead>Máximo</TableHead>
              <TableHead>Ganancia</TableHead>
              <TableHead>Acciones</TableHead>
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
                    onBlur={(e) => {
                      if (editingId !== tipo.id) {
                        handleEdit(tipo, "descripcion", e.target.value)
                      }
                    }}
                    className="w-64 h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={tipo.materialId || 1}
                    onChange={(e) => handleEdit(tipo, "materialId", Number.parseInt(e.target.value) || 1)}
                    className="w-16 h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={tipo.ancho || ""}
                    onChange={(e) => handleEdit(tipo, "ancho", e.target.value)}
                    className="w-20 h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={tipo.alto || ""}
                    onChange={(e) => handleEdit(tipo, "alto", e.target.value)}
                    className="w-20 h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={tipo.cantidadCristal || ""}
                    onChange={(e) => handleEdit(tipo, "cantidadCristal", e.target.value)}
                    className="w-16 h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={tipo.porcentajeQuincalleria || 0}
                    onChange={(e) => handleEdit(tipo, "porcentajeQuincalleria", Number.parseFloat(e.target.value) || 0)}
                    className="w-16 h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={tipo.largoPerfiles || 0}
                    onChange={(e) => handleEdit(tipo, "largoPerfiles", Number.parseInt(e.target.value) || 0)}
                    className="w-16 h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={tipo.minimo || 0}
                    onChange={(e) => handleEdit(tipo, "minimo", Number.parseInt(e.target.value) || 0)}
                    className="w-16 h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={tipo.maximo || 0}
                    onChange={(e) => handleEdit(tipo, "maximo", Number.parseInt(e.target.value) || 0)}
                    className="w-16 h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={tipo.ganancia || 0}
                    onChange={(e) => handleEdit(tipo, "ganancia", Number.parseInt(e.target.value) || 0)}
                    className="w-16 h-8"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(tipo.id)}
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
        Agregar Tipo
      </Button>
    </div>
  )
}
