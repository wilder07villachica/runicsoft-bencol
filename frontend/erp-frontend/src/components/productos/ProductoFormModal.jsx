import { useEffect, useState } from "react"
import { X } from "lucide-react"

const tiposProducto = [
  { value: "BIDON_20_LITROS", label: "Bidón 20 Litros" },
  { value: "BOTELLA_650_MILILITROS", label: "Botella 650 Mililitros" },
  { value: "BOTELLA_1_LITRO", label: "Botella 1 Litro" },
  { value: "BOTELLA_2_5_LITROS", label: "Botella 2.5 Litros" },
]

const estados = [
  { value: "ACTIVO", label: "Activo" },
  { value: "INACTIVO", label: "Inactivo" },
]

const initialForm = {
  tipo: "",
  precio: "",
  estado: "ACTIVO",
}

export default function ProductoFormModal({
  open,
  onClose,
  onSubmit,
  productoEditando,
}) {
  const [form, setForm] = useState(initialForm)

  useEffect(() => {
    if (productoEditando) {
      setForm({
        tipo: productoEditando.tipo || "",
        precio: productoEditando.precio ?? "",
        estado: productoEditando.estado || "ACTIVO",
      })
    } else {
      setForm(initialForm)
    }
  }, [productoEditando, open])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...form,
      precio: Number(form.precio),
    })
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-slate-900">
            {productoEditando ? "Editar producto" : "Nuevo producto"}
          </h2>
          <button onClick={onClose} className="rounded-xl p-2 hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 gap-4">
            <select
              name="tipo"
              value={form.tipo}
              onChange={handleChange}
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
              required
            >
              <option value="">Seleccione tipo de producto</option>
              {tiposProducto.map((tipo) => (
                <option key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </select>

            <input
              type="number"
              step="0.01"
              min="0"
              name="precio"
              value={form.precio}
              onChange={handleChange}
              placeholder="Precio"
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
              required
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
              {productoEditando ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}