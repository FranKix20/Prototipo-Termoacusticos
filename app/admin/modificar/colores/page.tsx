"use client"

import Link from "next/link"
import { useState } from "react"
import { type Color, getColores, actualizarColor, agregarColor } from "@/lib/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2 } from "lucide-react"

export default function ModificarColoresPage() {
  const [colores, setColores] = useState<Color[]>(getColores())

  const handleEdit = (color: Color, field: keyof Color, value: any) => {
    actualizarColor(color.id, { [field]: value })
    setColores(getColores())
  }

  const handleAdd = () => {
    agregarColor({
      nombre: "Nuevo Color",
    })
    setColores(getColores())
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
              <TableHead>ID</TableHead>
              <TableHead>Nombre Color</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {colores.map((color) => (
              <TableRow key={color.id}>
                <TableCell className="font-medium">{color.id}</TableCell>
                <TableCell>
                  <Input
                    value={color.nombre}
                    onChange={(e) => handleEdit(color, "nombre", e.target.value)}
                    className="w-96 h-8"
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
        Agregar Color
      </Button>
    </div>
  )
}
