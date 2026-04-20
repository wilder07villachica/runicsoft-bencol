import { X, Mail, Phone, MapPin, User, BadgeCheck } from "lucide-react"

const categoriaLabels = {
  DISTRIBUIDOR: "Distribuidor",
  CONSUMIDOR_FINAL: "Consumidor final",
  CORPORATIVO: "Corporativo",
}

const estadoLabels = {
  ACTIVO: "Activo",
  INACTIVO: "Inactivo",
}

export default function ClienteInfoModal({ open, onClose, cliente }) {
  if (!open || !cliente) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Información del cliente
            </h2>
            <p className="text-sm text-slate-500">
              Detalle general del registro seleccionado
            </p>
          </div>

          <button onClick={onClose} className="rounded-xl p-2 hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="rounded-3xl bg-slate-50 p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-500 text-white">
                <User size={24} />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">{cliente.nombre}</h3>
                <p className="text-sm text-slate-500">
                  Cliente #{cliente.id}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="mb-2 flex items-center gap-2 text-slate-600">
                <Mail size={16} />
                <span className="text-sm font-medium">Correo</span>
              </div>
              <p className="text-slate-900">{cliente.correo || "No registrado"}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="mb-2 flex items-center gap-2 text-slate-600">
                <Phone size={16} />
                <span className="text-sm font-medium">Teléfono</span>
              </div>
              <p className="text-slate-900">{cliente.telefono || "No registrado"}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-4 md:col-span-2">
              <div className="mb-2 flex items-center gap-2 text-slate-600">
                <MapPin size={16} />
                <span className="text-sm font-medium">Dirección</span>
              </div>
              <p className="text-slate-900">{cliente.direccion || "No registrada"}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="mb-2 flex items-center gap-2 text-slate-600">
                <BadgeCheck size={16} />
                <span className="text-sm font-medium">Categoría</span>
              </div>
              <p className="text-slate-900">
                {categoriaLabels[cliente.categoria] || cliente.categoria || "No registrada"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="mb-2 flex items-center gap-2 text-slate-600">
                <BadgeCheck size={16} />
                <span className="text-sm font-medium">Estado</span>
              </div>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  cliente.estado === "ACTIVO"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {estadoLabels[cliente.estado] || cliente.estado}
              </span>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
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