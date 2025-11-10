"use client"

import Link from "next/link"
import { useState } from "react"
import { type Quincalleria, getQuincallerias, actualizarQuincalleria, agregarQuincalleria } from "@/lib/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2 } from "lucide-react"

export default function ModificarQuincalleriaPage() {
  const [quincallerias, setQuincallerias] = useState<Quincalleria[]>(getQuincallerias())

  const handleEdit = (item: Quincalleria, field: keyof Quincalleria, value: any) => {
    actualizarQuincalleria(item.id, { [field]: value })
    setQuincallerias(getQuincallerias())
  }

  const handleAdd = () => {
    agregarQuincalleria({
      nombre: "Nueva Quincallería",
      descripcion: "Descripción",
      precio: 10000,
    })
    setQuincallerias(getQuincallerias())
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
                    value={item.nombre}
                    onChange={(e) => handleEdit(item, "nombre", e.target.value)}
                    className="w-40 h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={item.descripcion}
                    onChange={(e) => handleEdit(item, "descripcion", e.target.value)}
                    className="w-80 h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={item.precio}
                    onChange={(e) => handleEdit(item, "precio", Number.parseInt(e.target.value))}
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
        Agregar Quincallería
      </Button>
    </div>
  )
}
