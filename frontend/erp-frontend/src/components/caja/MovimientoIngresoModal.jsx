import { useEffect, useState } from "react"
import { X } from "lucide-react"

const metodoPagoOptions = [
  { value: "EFECTIVO", label: "Efectivo" },
  { value: "TRANSFERENCIA", label: "Transferencia" },
  { value: "YAPE_PLIN", label: "Yape / Plin" },
]

const origenOptions = [
  { value: "INGRESO_MANUAL", label: "Ingreso manual" },
  { value: "AJUSTE", label: "Ajuste" },
  { value: "APERTURA_CAJA", label: "Apertura de caja" },
]

const initialForm = {
  cajaId: "",
  tipo: "INGRESO",
  origen: "INGRESO_MANUAL",
  monto: "",
  metodoPago: "EFECTIVO",
  referencia: "",
  observacion: "",
  clienteId: "",
  ventaId: "",
}

export default function MovimientoIngresoModal({
  open,
  onClose,
  onSubmit,
  cajas,
  cajaPreseleccionada,
}) {
  const [form, setForm] = useState(initialForm)

  useEffect(() => {
    if (open) {
      setForm({
        ...initialForm,
        cajaId: cajaPreseleccionada ? String(cajaPreseleccionada) : "",
      })
    }
  }, [open, cajaPreseleccionada])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    onSubmit({
      cajaId: Number(form.cajaId),
      tipo: "INGRESO",
      origen: form.origen,
      monto: Number(form.monto),
      metodoPago: form.metodoPago,
      referencia: form.referencia || null,
      observacion: form.observacion || null,
      clienteId: form.clienteId ? Number(form.clienteId) : null,
      ventaId: form.ventaId ? Number(form.ventaId) : null,
      categoriaEgreso: null,
    })
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-slate-900">Nuevo ingreso</h2>
          <button onClick={onClose} className="rounded-xl p-2 hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <select
            name="cajaId"
            value={form.cajaId}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
            required
          >
            <option value="">Seleccione caja</option>
            {cajas.map((caja) => (
              <option key={caja.id} value={caja.id}>
                {caja.nombre}
              </option>
            ))}
          </select>

          <select
            name="origen"
            value={form.origen}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
            required
          >
            {origenOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <input
            type="number"
            step="0.01"
            min="0.01"
            name="monto"
            value={form.monto}
            onChange={handleChange}
            placeholder="Monto"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
            required
          />

          <select
            name="metodoPago"
            value={form.metodoPago}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
          >
            {metodoPagoOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <input
            name="referencia"
            value={form.referencia}
            onChange={handleChange}
            placeholder="Referencia"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
          />

          <input
            name="observacion"
            value={form.observacion}
            onChange={handleChange}
            placeholder="Observación"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
          />

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
              Registrar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}