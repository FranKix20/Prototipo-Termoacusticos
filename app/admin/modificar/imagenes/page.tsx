"use client"

import Link from "next/link"
import { useState } from "react"
import { type Imagen, getImagenes } from "@/lib/database"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2 } from "lucide-react"

export default function ModificarImagenesPage() {
  const [imagenes, setImagenes] = useState<Imagen[]>(getImagenes())

  const handleAdd = () => {
    alert("Funcionalidad de carga de imágenes próximamente")
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
        <span>Imágenes</span>
      </div>

      {imagenes.length === 0 ? (
        <div className="text-center py-12 border border-border rounded-lg bg-gray-50">
          <p className="text-muted-foreground mb-4">No hay imágenes cargadas</p>
          <Button onClick={handleAdd} className="bg-teal-600 hover:bg-teal-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Cargar Imagen
          </Button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto border border-border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {imagenes.map((imagen) => (
                  <TableRow key={imagen.id}>
                    <TableCell className="font-medium">{imagen.id}</TableCell>
                    <TableCell>{imagen.nombre}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{imagen.url}</TableCell>
                    <TableCell>{imagen.tipo}</TableCell>
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
            Agregar Imagen
          </Button>
        </>
      )}
    </div>
  )
}
