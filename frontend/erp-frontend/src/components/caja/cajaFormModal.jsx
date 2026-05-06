import { useEffect, useState } from "react"

export default function CajaFormModal({ onClose, onSubmit, cajaEditando }) {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    saldoInicial: 0,
    activa: true,
    principal: false,
  })

  useEffect(() => {
    if (cajaEditando) {
      setForm({
        nombre: cajaEditando.nombre || "",
        descripcion: cajaEditando.descripcion || "",
        saldoInicial: cajaEditando.saldoInicial ?? cajaEditando.saldoActual ?? 0,
        activa: cajaEditando.activa ?? true,
        principal: cajaEditando.principal ?? false,
      })
    }
  }, [cajaEditando])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    onSubmit({
      ...form,
      saldoInicial: Number(form.saldoInicial || 0),
    })
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            {cajaEditando ? "Editar caja" : "Nueva caja"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-3 py-1 text-slate-500 hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">
              Nombre
            </label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
              placeholder="Ej: Caja Principal"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
              placeholder="Descripción opcional"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">
              Saldo inicial
            </label>
            <input
              name="saldoInicial"
              type="number"
              step="0.01"
              value={form.saldoInicial}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              name="activa"
              checked={form.activa}
              onChange={handleChange}
            />
            Caja activa
          </label>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              name="principal"
              checked={form.principal}
              onChange={handleChange}
            />
            Marcar como caja principal
          </label>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-200 px-5 py-3 font-medium text-slate-600"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="rounded-2xl bg-violet-600 px-5 py-3 font-medium text-white shadow-lg"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}