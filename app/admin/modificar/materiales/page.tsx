"use client"

import Link from "next/link"
import { useState } from "react"
import { type Material, getMateriales, actualizarMaterial, agregarMaterial } from "@/lib/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2 } from "lucide-react"

export default function ModificarMaterialesPage() {
  const [materiales, setMateriales] = useState<Material[]>(getMateriales())

  const handleEdit = (material: Material, field: keyof Material, value: any) => {
    actualizarMaterial(material.id, { [field]: value })
    setMateriales(getMateriales())
  }

  const handleAdd = () => {
    agregarMaterial({
      nombre: "Nuevo Material",
      textoLibrePDF: "Descripción del material",
      texto1: "Texto 1",
      texto2: "Texto 2",
    })
    setMateriales(getMateriales())
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
              <TableHead>ID</TableHead>
              <TableHead>Nombre Material</TableHead>
              <TableHead>Texto Libre PDF</TableHead>
              <TableHead>Texto 1</TableHead>
              <TableHead>Texto 2</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {materiales.map((material) => (
              <TableRow key={material.id}>
                <TableCell className="font-medium">{material.id}</TableCell>
                <TableCell>
                  <Input
                    value={material.nombre}
                    onChange={(e) => handleEdit(material, "nombre", e.target.value)}
                    className="w-80 h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={material.textoLibrePDF}
                    onChange={(e) => handleEdit(material, "textoLibrePDF", e.target.value)}
                    className="w-96 h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={material.texto1}
                    onChange={(e) => handleEdit(material, "texto1", e.target.value)}
                    className="w-48 h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={material.texto2}
                    onChange={(e) => handleEdit(material, "texto2", e.target.value)}
                    className="w-48 h-8"
                  />
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
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
