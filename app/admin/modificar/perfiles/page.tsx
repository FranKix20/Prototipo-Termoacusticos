"use client"

import Link from "next/link"
import { useState } from "react"
import { type Perfil, getPerfiles, actualizarPerfil, agregarPerfil } from "@/lib/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2 } from "lucide-react"

export default function ModificarPerfilesPage() {
  const [perfiles, setPerfiles] = useState<Perfil[]>(getPerfiles())

  const handleEdit = (perfil: Perfil, field: keyof Perfil, value: any) => {
    actualizarPerfil(perfil.id, { [field]: value })
    setPerfiles(getPerfiles())
  }

  const handleAdd = () => {
    agregarPerfil({
      nombre: "Nuevo Perfil",
      descripcion: "Descripción del perfil",
      grosor: 70,
    })
    setPerfiles(getPerfiles())
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
                    value={perfil.nombre}
                    onChange={(e) => handleEdit(perfil, "nombre", e.target.value)}
                    className="w-40 h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={perfil.descripcion}
                    onChange={(e) => handleEdit(perfil, "descripcion", e.target.value)}
                    className="w-80 h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={perfil.grosor}
                    onChange={(e) => handleEdit(perfil, "grosor", Number.parseInt(e.target.value))}
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
        Agregar Perfil
      </Button>
    </div>
  )
}
