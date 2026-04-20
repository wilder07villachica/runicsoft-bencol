import { useEffect, useState } from "react"
import { X } from "lucide-react"

const tiposPrecio = [
  { value: "POR_MAYOR", label: "Por mayor" },
  { value: "POR_MENOR", label: "Por menor" },
]

const initialForm = {
  productoId: "",
  precio: "",
  tipoPrecio: "POR_MENOR",
  cantidadMinima: 1,
}

export default function PrecioFormModal({
  open,
  onClose,
  onSubmit,
  precioEditando,
  productos,
}) {
  const [form, setForm] = useState(initialForm)

  useEffect(() => {
    if (precioEditando) {
      setForm({
        productoId: precioEditando.productoId || "",
        precio: precioEditando.precio ?? "",
        tipoPrecio: precioEditando.tipoPrecio || "POR_MENOR",
        cantidadMinima: precioEditando.cantidadMinima ?? 1,
      })
    } else {
      setForm(initialForm)
    }
  }, [precioEditando, open])

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
      productoId: Number(form.productoId),
      precio: Number(form.precio),
      cantidadMinima: Number(form.cantidadMinima),
    })
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-slate-900">
            {precioEditando ? "Editar precio" : "Nuevo precio"}
          </h2>
          <button onClick={onClose} className="rounded-xl p-2 hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <select
            name="productoId"
            value={form.productoId}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
            required
          >
            <option value="">Seleccione producto</option>
            {productos.map((producto) => (
              <option key={producto.id} value={producto.id}>
                {producto.tipo}
              </option>
            ))}
          </select>

          <select
            name="tipoPrecio"
            value={form.tipoPrecio}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
            required
          >
            {tiposPrecio.map((tipo) => (
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
            placeholder="Precio especial"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
            required
          />

          <input
            type="number"
            min="1"
            name="cantidadMinima"
            value={form.cantidadMinima}
            onChange={handleChange}
            placeholder="Cantidad mínima"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
            required
          />

          <div className="flex justify-end gap-3">
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
              {precioEditando ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}