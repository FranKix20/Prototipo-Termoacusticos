"use client"

import Link from "next/link"
import { useState } from "react"
import { type Cristal, getCristales, actualizarCristal, agregarCristal } from "@/lib/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2 } from "lucide-react"

export default function ModificarCristalesPage() {
  const [cristales, setCristales] = useState<Cristal[]>(getCristales())

  const handleEdit = (cristal: Cristal, field: keyof Cristal, value: any) => {
    actualizarCristal(cristal.id, { [field]: value })
    setCristales(getCristales())
  }

  const handleAdd = () => {
    agregarCristal({
      descripcion: "Nuevo Cristal",
      precio: 30000,
    })
    setCristales(getCristales())
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
                    value={cristal.descripcion}
                    onChange={(e) => handleEdit(cristal, "descripcion", e.target.value)}
                    className="w-96 h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={cristal.precio}
                    onChange={(e) => handleEdit(cristal, "precio", Number.parseInt(e.target.value))}
                    className="w-24 h-8"
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
        Agregar Cristal
      </Button>
    </div>
  )
}
