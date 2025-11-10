"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import type { Imagen } from "@/lib/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function ModificarImagenesPage() {
  const [imagenes, setImagenes] = useState<Imagen[]>([])
  const [loading, setLoading] = useState(true)
  const [newImage, setNewImage] = useState({ nombre: "", url: "", tipo: "producto" })
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchImagenes()
  }, [])

  const fetchImagenes = async () => {
    try {
      const res = await fetch("/api/imagenes")
      const { data } = await res.json()
      setImagenes(data)
      setLoading(false)
    } catch (error) {
      toast({ title: "Error", description: "No se pudieron cargar las imágenes", variant: "destructive" })
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    if (!newImage.nombre || !newImage.url) {
      toast({ title: "Error", description: "Completa todos los campos", variant: "destructive" })
      return
    }

    try {
      await fetch("/api/imagenes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newImage),
      })
      fetchImagenes()
      setNewImage({ nombre: "", url: "", tipo: "producto" })
      setOpen(false)
      toast({ title: "Éxito", description: "Imagen agregada correctamente" })
    } catch (error) {
      toast({ title: "Error", description: "No se pudo agregar la imagen", variant: "destructive" })
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta imagen?")) {
      try {
        await fetch("/api/imagenes", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        })
        fetchImagenes()
        toast({ title: "Éxito", description: "Imagen eliminada correctamente" })
      } catch (error) {
        toast({ title: "Error", description: "No se pudo eliminar la imagen", variant: "destructive" })
      }
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
        <span>Imágenes</span>
      </div>

      {imagenes.length === 0 ? (
        <div className="text-center py-12 border border-border rounded-lg bg-gray-50">
          <p className="text-muted-foreground mb-4">No hay imágenes cargadas</p>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Cargar Imagen
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Nueva Imagen</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Nombre de la imagen"
                  value={newImage.nombre}
                  onChange={(e) => setNewImage({ ...newImage, nombre: e.target.value })}
                />
                <Input
                  placeholder="URL de la imagen"
                  value={newImage.url}
                  onChange={(e) => setNewImage({ ...newImage, url: e.target.value })}
                />
                <select
                  className="w-full border border-border rounded px-3 py-2"
                  value={newImage.tipo}
                  onChange={(e) => setNewImage({ ...newImage, tipo: e.target.value })}
                >
                  <option value="producto">Producto</option>
                  <option value="portada">Portada</option>
                  <option value="galeria">Galería</option>
                </select>
                <Button onClick={handleAdd} className="w-full bg-teal-600 hover:bg-teal-700">
                  Guardar Imagen
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto border border-border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead>Nombre</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {imagenes.map((imagen) => (
                  <TableRow key={imagen.id}>
                    <TableCell className="font-medium">{imagen.nombre}</TableCell>
                    <TableCell className="text-sm text-muted-foreground truncate max-w-xs">{imagen.url}</TableCell>
                    <TableCell>{imagen.tipo}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(imagen.id)}
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

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-teal-600 hover:bg-teal-700 text-white w-full">
                <Plus className="w-4 h-4 mr-2" />
                Agregar Imagen
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Nueva Imagen</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Nombre de la imagen"
                  value={newImage.nombre}
                  onChange={(e) => setNewImage({ ...newImage, nombre: e.target.value })}
                />
                <Input
                  placeholder="URL de la imagen"
                  value={newImage.url}
                  onChange={(e) => setNewImage({ ...newImage, url: e.target.value })}
                />
                <select
                  className="w-full border border-border rounded px-3 py-2"
                  value={newImage.tipo}
                  onChange={(e) => setNewImage({ ...newImage, tipo: e.target.value })}
                >
                  <option value="producto">Producto</option>
                  <option value="portada">Portada</option>
                  <option value="galeria">Galería</option>
                </select>
                <Button onClick={handleAdd} className="w-full bg-teal-600 hover:bg-teal-700">
                  Guardar Imagen
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  )
}
