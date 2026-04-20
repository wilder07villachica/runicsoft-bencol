import { useEffect, useState } from "react"
import { X } from "lucide-react"

const categorias = [
  { value: "DISTRIBUIDOR", label: "Distribuidor" },
  { value: "CONSUMIDOR_FINAL", label: "Consumidor final" },
  { value: "CORPORATIVO", label: "Corporativo" },
]

const estados = [
  { value: "ACTIVO", label: "Activo" },
  { value: "INACTIVO", label: "Inactivo" },
]

const initialForm = {
  nombre: "",
  direccion: "",
  correo: "",
  telefono: "",
  categoria: "",
  estado: "ACTIVO",
}

export default function ClienteFormModal({
  open,
  onClose,
  onSubmit,
  clienteEditando,
}) {
  const [form, setForm] = useState(initialForm)

  useEffect(() => {
    if (clienteEditando) {
      setForm({
        nombre: clienteEditando.nombre || "",
        direccion: clienteEditando.direccion || "",
        correo: clienteEditando.correo || "",
        telefono: clienteEditando.telefono || "",
        categoria: clienteEditando.categoria || "",
        estado: clienteEditando.estado || "ACTIVO",
      })
    } else {
      setForm(initialForm)
    }
  }, [clienteEditando, open])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-slate-900">
            {clienteEditando ? "Editar cliente" : "Nuevo cliente"}
          </h2>
          <button onClick={onClose} className="rounded-xl p-2 hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Nombre"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
              required
            />

            <input
              name="correo"
              type="email"
              value={form.correo}
              onChange={handleChange}
              placeholder="Correo"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
              required
            />

            <input
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              placeholder="Teléfono"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
            />

            <select
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
              required
            >
              <option value="">Seleccione categoría</option>
              {categorias.map((categoria) => (
                <option key={categoria.value} value={categoria.value}>
                  {categoria.label}
                </option>
              ))}
            </select>

            <input
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              placeholder="Dirección"
              className="md:col-span-2 rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
            />

            <select
              name="estado"
              value={form.estado}
              onChange={handleChange}
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
              required
            >
              {estados.map((estado) => (
                <option key={estado.value} value={estado.value}>
                  {estado.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-200 px-5 py-3 font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-500 px-5 py-3 font-medium text-white shadow-lg"
            >
              {clienteEditando ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}