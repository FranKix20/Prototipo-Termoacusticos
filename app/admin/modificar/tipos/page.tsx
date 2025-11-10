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
      const res = await fetch("/api/tipos")
      const { data } = await res.json()
      setTipos(data)
      setLoading(false)
    } catch (error) {
      toast({ title: "Error", description: "No se pudieron cargar los tipos", variant: "destructive" })
      setLoading(false)
    }
  }

  const handleEdit = async (tipo: Tipo, field: keyof Tipo, value: any) => {
    try {
      const updatedTipo = { ...tipo, [field]: value }
      await fetch("/api/tipos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: tipo.id, ...updatedTipo }),
      })
      fetchTipos()
      toast({ title: "Éxito", description: "Tipo actualizado correctamente" })
    } catch (error) {
      toast({ title: "Error", description: "No se pudo actualizar el tipo", variant: "destructive" })
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar este tipo?")) {
      try {
        await fetch("/api/tipos", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        })
        fetchTipos()
        toast({ title: "Éxito", description: "Tipo eliminado correctamente" })
      } catch (error) {
        toast({ title: "Error", description: "No se pudo eliminar el tipo", variant: "destructive" })
      }
    }
  }

  const handleAdd = async () => {
    try {
      await fetch("/api/tipos", {
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
      fetchTipos()
      toast({ title: "Éxito", description: "Tipo agregado correctamente" })
    } catch (error) {
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
                    className="w-64 h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={tipo.materialId}
                    onChange={(e) => handleEdit(tipo, "materialId", Number.parseInt(e.target.value))}
                    className="w-16 h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={tipo.ancho}
                    onChange={(e) => handleEdit(tipo, "ancho", e.target.value)}
                    className="w-20 h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={tipo.alto}
                    onChange={(e) => handleEdit(tipo, "alto", e.target.value)}
                    className="w-20 h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={tipo.cantidadCristal}
                    onChange={(e) => handleEdit(tipo, "cantidadCristal", e.target.value)}
                    className="w-16 h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={tipo.porcentajeQuincalleria}
                    onChange={(e) => handleEdit(tipo, "porcentajeQuincalleria", Number.parseFloat(e.target.value))}
                    className="w-16 h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={tipo.largoPerfiles}
                    onChange={(e) => handleEdit(tipo, "largoPerfiles", Number.parseInt(e.target.value))}
                    className="w-16 h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={tipo.minimo}
                    onChange={(e) => handleEdit(tipo, "minimo", Number.parseInt(e.target.value))}
                    className="w-16 h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={tipo.maximo}
                    onChange={(e) => handleEdit(tipo, "maximo", Number.parseInt(e.target.value))}
                    className="w-16 h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={tipo.ganancia}
                    onChange={(e) => handleEdit(tipo, "ganancia", Number.parseInt(e.target.value))}
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
