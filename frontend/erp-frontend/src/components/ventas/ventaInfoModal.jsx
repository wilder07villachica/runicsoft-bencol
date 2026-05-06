import { X } from "lucide-react"

const metodoPagoLabels = {
  EFECTIVO: "Efectivo",
  TRANSFERENCIA: "Transferencia",
  YAPE_PLIN: "Yape / Plin",
}

const tipoPagoLabels = {
  CREDITO: "Crédito",
  CANCELADO: "Cancelado",
  ABONO: "Abono",
}

const estadoVentaLabels = {
  ATENDIDO: "Atendido",
  EN_ESPERA: "En espera",
  CANCELADO: "Cancelado",
  REPROGRAMADO: "Reprogramado",
}

const tipoProductoLabels = {
  BIDON_20_LITROS: "Bidón 20 Litros",
  BOTELLA_650_MILILITROS: "Botella 650 Mililitros",
  BOTELLA_1_LITRO: "Botella 1 Litro",
  BOTELLA_2_5_LITROS: "Botella 2.5 Litros",
}

function formatFecha(fecha) {
  if (!fecha) return "-"
  return new Date(fecha).toLocaleString()
}

export default function VentaInfoModal({ open, onClose, venta }) {
  if (!open || !venta) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Detalle de venta
            </h2>
            <p className="text-sm text-slate-500">
              Venta #{venta.id}
            </p>
          </div>

          <button onClick={onClose} className="rounded-xl p-2 hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <InfoCard label="Cliente" value={venta.nombreCliente} />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InfoCard
                label="Método de pago"
                value={metodoPagoLabels[venta.metodoPago] || venta.metodoPago}
              />
              <InfoCard
                label="Tipo de pago"
                value={tipoPagoLabels[venta.tipoPago] || venta.tipoPago}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InfoCard
                label="Estado"
                value={estadoVentaLabels[venta.estadoVenta] || venta.estadoVenta}
              />
              <InfoCard
                label="Fecha"
                value={formatFecha(venta.fechaCreacion)}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InfoCard
                label="Cantidad pagada"
                value={`S/ ${Number(venta.cantidadPagada ?? 0).toFixed(2)}`}
              />
              <InfoCard
                label="Total a pagar"
                value={`S/ ${Number(venta.totalPagar ?? 0).toFixed(2)}`}
                strong
              />
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-slate-200">
            <div className="border-b border-slate-200 px-5 py-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Productos vendidos
              </h3>
              <p className="text-sm text-slate-500">
                Detalle de ítems registrados en la venta
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-slate-500">
                    <th className="px-5 py-3 font-medium">Producto</th>
                    <th className="px-5 py-3 font-medium">Cantidad</th>
                    <th className="px-5 py-3 font-medium">P. unitario</th>
                    <th className="px-5 py-3 font-medium">Subtotal</th>
                  </tr>
                </thead>

                <tbody>
                  {venta.detalleVentas?.map((detalle, index) => (
                    <tr
                      key={`${detalle.id ?? "sin-id"}-${index}`}
                      className="border-b border-slate-100 last:border-b-0"
                    >
                      <td className="px-5 py-3 text-slate-700">
                        {tipoProductoLabels[detalle.tipoProducto] || detalle.tipoProducto}
                      </td>
                      <td className="px-5 py-3 text-slate-700">
                        {detalle.cantidad}
                      </td>
                      <td className="px-5 py-3 text-slate-700">
                        S/ {Number(detalle.precioUnitario ?? 0).toFixed(2)}
                      </td>
                      <td className="px-5 py-3 font-medium text-slate-900">
                        S/ {Number(detalle.subtotal ?? 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

function InfoCard({ label, value, strong = false }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-1 ${strong ? "text-lg font-semibold text-slate-900" : "font-medium text-slate-900"}`}>
        {value || "-"}
      </p>
    </div>
  )
}