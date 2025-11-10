"use client"

import { useState } from "react"
import { type Tipo, getTipos, actualizarTipo, agregarTipo, eliminarTipo } from "@/lib/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Plus } from "lucide-react"

export function EditarTiposTable() {
  const [tipos, setTipos] = useState<Tipo[]>(getTipos())
  const [editingId, setEditingId] = useState<number | null>(null)

  const handleEdit = (tipo: Tipo, field: keyof Tipo, value: any) => {
    actualizarTipo(tipo.id, { [field]: value })
    setTipos(getTipos())
  }

  const handleDelete = (id: number) => {
    eliminarTipo(id)
    setTipos(getTipos())
  }

  const handleAdd = () => {
    agregarTipo({
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
    })
    setTipos(getTipos())
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
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
                <TableCell>{tipo.id}</TableCell>
                <TableCell>
                  <Input
                    value={tipo.descripcion}
                    onChange={(e) => handleEdit(tipo, "descripcion", e.target.value)}
                    className="w-64"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={tipo.materialId}
                    onChange={(e) => handleEdit(tipo, "materialId", Number.parseInt(e.target.value))}
                    className="w-20"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={tipo.ancho}
                    onChange={(e) => handleEdit(tipo, "ancho", e.target.value)}
                    className="w-24"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={tipo.alto}
                    onChange={(e) => handleEdit(tipo, "alto", e.target.value)}
                    className="w-24"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={tipo.cantidadCristal}
                    onChange={(e) => handleEdit(tipo, "cantidadCristal", e.target.value)}
                    className="w-20"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={tipo.porcentajeQuincalleria}
                    onChange={(e) => handleEdit(tipo, "porcentajeQuincalleria", Number.parseFloat(e.target.value))}
                    className="w-20"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={tipo.largoPerfiles}
                    onChange={(e) => handleEdit(tipo, "largoPerfiles", Number.parseInt(e.target.value))}
                    className="w-20"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={tipo.minimo}
                    onChange={(e) => handleEdit(tipo, "minimo", Number.parseInt(e.target.value))}
                    className="w-20"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={tipo.maximo}
                    onChange={(e) => handleEdit(tipo, "maximo", Number.parseInt(e.target.value))}
                    className="w-20"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={tipo.ganancia}
                    onChange={(e) => handleEdit(tipo, "ganancia", Number.parseInt(e.target.value))}
                    className="w-20"
                  />
                </TableCell>
                <TableCell>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(tipo.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Button onClick={handleAdd} className="bg-teal-600 hover:bg-teal-700">
        <Plus className="w-4 h-4 mr-2" />
        Agregar Tipo
      </Button>
    </div>
  )
}
