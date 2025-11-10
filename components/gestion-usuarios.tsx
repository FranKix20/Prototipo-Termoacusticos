"use client"

import { useState } from "react"
import { getUsuarios, agregarUsuario, actualizarUsuario, eliminarUsuario, type Usuario } from "@/lib/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Trash2, Edit2, Check, X } from "lucide-react"

export function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>(getUsuarios())
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    correo: "",
    contraseña: "",
  })
  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [datosEdicion, setDatosEdicion] = useState<Partial<Usuario>>({})
  const [error, setError] = useState("")

  const validarCorreo = (correo: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)
  }

  const validarContraseña = (contraseña: string) => {
    return contraseña.length >= 6
  }

  const handleAgregarUsuario = () => {
    setError("")

    if (!nuevoUsuario.nombre.trim()) {
      setError("El nombre es requerido")
      return
    }

    if (!validarCorreo(nuevoUsuario.correo)) {
      setError("Ingrese un correo válido")
      return
    }

    if (!validarContraseña(nuevoUsuario.contraseña)) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    agregarUsuario({
      nombre: nuevoUsuario.nombre,
      correo: nuevoUsuario.correo,
      contraseña: nuevoUsuario.contraseña,
    })

    setUsuarios(getUsuarios())
    setNuevoUsuario({ nombre: "", correo: "", contraseña: "" })
  }

  const handleEditarUsuario = (usuario: Usuario) => {
    setEditandoId(usuario.id)
    setDatosEdicion({ ...usuario })
    setError("")
  }

  const handleGuardarEdicion = () => {
    if (!datosEdicion.nombre?.trim()) {
      setError("El nombre es requerido")
      return
    }

    if (!validarCorreo(datosEdicion.correo || "")) {
      setError("Ingrese un correo válido")
      return
    }

    if (!validarContraseña(datosEdicion.contraseña || "")) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    actualizarUsuario(editandoId!, {
      nombre: datosEdicion.nombre,
      correo: datosEdicion.correo,
      contraseña: datosEdicion.contraseña,
    })

    setUsuarios(getUsuarios())
    setEditandoId(null)
    setDatosEdicion({})
  }

  const handleEliminarUsuario = (id: number) => {
    if (confirm("¿Está seguro de que desea eliminar este usuario?")) {
      eliminarUsuario(id)
      setUsuarios(getUsuarios())
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-card">
        <h2 className="text-xl font-bold text-foreground mb-4">Crear Nuevo Usuario</h2>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md text-sm">{error}</div>}

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Nombre</label>
            <Input
              type="text"
              placeholder="Nombre del usuario"
              value={nuevoUsuario.nombre}
              onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })}
              className="bg-background text-foreground border-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Correo Electrónico</label>
            <Input
              type="email"
              placeholder="correo@ejemplo.com"
              value={nuevoUsuario.correo}
              onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, correo: e.target.value })}
              className="bg-background text-foreground border-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Contraseña</label>
            <Input
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={nuevoUsuario.contraseña}
              onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, contraseña: e.target.value })}
              className="bg-background text-foreground border-input"
            />
          </div>

          <Button onClick={handleAgregarUsuario} className="w-full bg-teal-600 hover:bg-teal-700 text-white">
            Crear Usuario
          </Button>
        </div>
      </Card>

      <Card className="p-6 bg-card">
        <h2 className="text-xl font-bold text-foreground mb-4">Usuarios Registrados</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Nombre</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Correo</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Contraseña</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Fecha Creación</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id} className="border-b border-border hover:bg-muted/50">
                  {editandoId === usuario.id ? (
                    <>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{usuario.id}</td>
                      <td className="px-4 py-3">
                        <Input
                          type="text"
                          value={datosEdicion.nombre || ""}
                          onChange={(e) => setDatosEdicion({ ...datosEdicion, nombre: e.target.value })}
                          className="h-8 text-sm"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          type="email"
                          value={datosEdicion.correo || ""}
                          onChange={(e) => setDatosEdicion({ ...datosEdicion, correo: e.target.value })}
                          className="h-8 text-sm"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          type="password"
                          value={datosEdicion.contraseña || ""}
                          onChange={(e) => setDatosEdicion({ ...datosEdicion, contraseña: e.target.value })}
                          className="h-8 text-sm"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {new Date(usuario.fechaCreacion).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-2">
                          <Button
                            onClick={handleGuardarEdicion}
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 bg-transparent"
                          >
                            <Check className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button
                            onClick={() => setEditandoId(null)}
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                          >
                            <X className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{usuario.id}</td>
                      <td className="px-4 py-3 text-sm font-medium text-foreground">{usuario.nombre}</td>
                      <td className="px-4 py-3 text-sm text-foreground">{usuario.correo}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {"•".repeat(usuario.contraseña.length)}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {new Date(usuario.fechaCreacion).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-2">
                          <Button
                            onClick={() => handleEditarUsuario(usuario)}
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                          >
                            <Edit2 className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button
                            onClick={() => handleEliminarUsuario(usuario.id)}
                            size="sm"
                            variant="outline"
                            className="h-8 w-0 p-0"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
