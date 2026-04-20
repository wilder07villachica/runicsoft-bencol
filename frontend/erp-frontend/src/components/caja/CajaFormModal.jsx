import { useEffect, useState } from "react"
import { X } from "lucide-react"

const initialForm = {
  nombre: "",
  descripcion: "",
  saldoActual: "",
  activa: true,
  principal: false,
}

export default function CajaFormModal({
  open,
  onClose,
  onSubmit,
  cajaEditando,
}) {
  const [form, setForm] = useState(initialForm)

  useEffect(() => {
    if (cajaEditando) {
      setForm({
        nombre: cajaEditando.nombre || "",
        descripcion: cajaEditando.descripcion || "",
        saldoActual: cajaEditando.saldoActual ?? "",
        activa: cajaEditando.activa ?? true,
        principal: cajaEditando.principal ?? false,
      })
    } else {
      setForm(initialForm)
    }
  }, [cajaEditando, open])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (cajaEditando) {
      onSubmit({
        nombre: form.nombre,
        descripcion: form.descripcion,
      })
      return
    }

    onSubmit({
      nombre: form.nombre,
      descripcion: form.descripcion,
      saldoActual: form.saldoActual === "" ? 0 : Number(form.saldoActual),
      activa: form.activa,
      principal: form.principal,
    })
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-slate-900">
            {cajaEditando ? "Editar caja" : "Nueva caja"}
          </h2>
          <button onClick={onClose} className="rounded-xl p-2 hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Nombre"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
            required
          />

          <input
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            placeholder="Descripción"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
          />

          {!cajaEditando && (
            <>
              <input
                type="number"
                step="0.01"
                min="0"
                name="saldoActual"
                value={form.saldoActual}
                onChange={handleChange}
                placeholder="Saldo inicial"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
              />

              <label className="flex items-center gap-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  name="activa"
                  checked={form.activa}
                  onChange={handleChange}
                />
                Caja activa
              </label>

              <label className="flex items-center gap-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  name="principal"
                  checked={form.principal}
                  onChange={handleChange}
                />
                Marcar como principal
              </label>
            </>
          )}

          <div className="flex justify-end gap-3 pt-2">
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
              {cajaEditando ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}