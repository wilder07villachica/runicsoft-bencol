import { useState, useEffect } from "react"

export default function MovimientoEgresoModal({
  onClose,
  onSubmit,
  cajas = [],
  cajaPreseleccionada = null,
}) {
  const [form, setForm] = useState({
    cajaId: "",
    monto: "",
    categoriaEgreso: "COMPRA_INSUMOS",
    descripcion: "",
  })

  useEffect(() => {
    if (cajaPreseleccionada) {
      setForm((prev) => ({
        ...prev,
        cajaId: cajaPreseleccionada,
      }))
    }
  }, [cajaPreseleccionada])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!form.cajaId || !form.monto || !form.categoriaEgreso) {
      alert("Completa los campos obligatorios")
      return
    }

    onSubmit({
      cajaId: Number(form.cajaId),
      monto: Number(form.monto),
      categoriaEgreso: form.categoriaEgreso,
      descripcion: form.descripcion,
    })
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            Registrar egreso
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
              Caja
            </label>
            <select
              name="cajaId"
              value={form.cajaId}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
            >
              <option value="">Selecciona una caja</option>
              {cajas.map((caja) => (
                <option key={caja.id} value={caja.id}>
                  {caja.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">
              Monto
            </label>
            <input
              type="number"
              name="monto"
              step="0.01"
              min="0.01"
              value={form.monto}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">
              Categoría de egreso
            </label>
            <select
              name="categoriaEgreso"
              value={form.categoriaEgreso}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
            >
              <option value="COMPRA_INSUMOS">Compra de insumos</option>
              <option value="SERVICIOS">Servicios</option>
              <option value="PLANILLA">Planilla</option>
              <option value="MANTENIMIENTO">Mantenimiento</option>
              <option value="TRANSPORTE">Transporte</option>
              <option value="OTROS">Otros</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
            />
          </div>

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
              className="rounded-2xl bg-red-600 px-5 py-3 font-medium text-white shadow-lg"
            >
              Guardar egreso
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}