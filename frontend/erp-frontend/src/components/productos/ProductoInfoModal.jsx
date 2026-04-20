import { X, Package, BadgeCheck, DollarSign } from "lucide-react"

const tipoProductoLabels = {
  BIDON_20_LITROS: "Bidón 20 Litros",
  BOTELLA_650_MILILITROS: "Botella 650 Mililitros",
  BOTELLA_1_LITRO: "Botella 1 Litro",
  BOTELLA_2_5_LITROS: "Botella 2.5 Litros",
}

export default function ProductoInfoModal({ open, onClose, producto }) {
  if (!open || !producto) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-slate-900">
            Información del producto
          </h2>
          <button onClick={onClose} className="rounded-xl p-2 hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="rounded-2xl border border-slate-200 p-4">
            <div className="mb-2 flex items-center gap-2 text-slate-600">
              <Package size={16} />
              <span className="text-sm font-medium">Tipo de producto</span>
            </div>
            <p className="text-slate-900">
              {tipoProductoLabels[producto.tipo] || producto.tipo}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-4">
            <div className="mb-2 flex items-center gap-2 text-slate-600">
              <DollarSign size={16} />
              <span className="text-sm font-medium">Precio base</span>
            </div>
            <p className="text-slate-900">S/ {Number(producto.precio).toFixed(2)}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-4">
            <div className="mb-2 flex items-center gap-2 text-slate-600">
              <BadgeCheck size={16} />
              <span className="text-sm font-medium">Estado</span>
            </div>
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                producto.estado === "ACTIVO"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-200 text-slate-700"
              }`}
            >
              {producto.estado === "ACTIVO" ? "Activo" : "Inactivo"}
            </span>
          </div>

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-500 px-5 py-3 font-medium text-white shadow-lg"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}