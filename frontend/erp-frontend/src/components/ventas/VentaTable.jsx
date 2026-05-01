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

const estadoCobroLabels = {
  PENDIENTE: "Pendiente",
  PARCIAL: "Parcial",
  PAGADA: "Pagada",
}

function formatFecha(fecha) {
  if (!fecha) return "-"
  return new Date(fecha).toLocaleString()
}

function EstadoCobroBadge({ estado }) {
  if (!estado) {
    return (
      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
        Contado
      </span>
    )
  }

  const className =
    estado === "PAGADA"
      ? "bg-emerald-100 text-emerald-700"
      : estado === "PARCIAL"
        ? "bg-amber-100 text-amber-700"
        : "bg-red-100 text-red-700"

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${className}`}>
      {estadoCobroLabels[estado] || estado}
    </span>
  )
}

export default function VentaTable({ ventas, onInfo, onEntregar }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-slate-900">Ventas</h3>
        <p className="text-sm text-slate-500">
          Lista general de ventas registradas
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1150px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="pb-3">ID</th>
              <th className="pb-3">Cliente</th>
              <th className="pb-3">Fecha</th>
              <th className="pb-3">Método</th>
              <th className="pb-3">Tipo pago</th>
              <th className="pb-3">Pagado</th>
              <th className="pb-3">Saldo</th>
              <th className="pb-3">Total</th>
              <th className="pb-3">Cobro</th>
              <th className="pb-3">Estado venta</th>
              <th className="pb-3">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {ventas.map((venta, index) => (
              <tr
                key={`${venta.id ?? "sin-id"}-${index}`}
                className="border-b border-slate-100"
              >
                <td className="py-4 font-medium text-slate-700">#{venta.id}</td>

                <td className="py-4 text-slate-700">{venta.nombreCliente}</td>

                <td className="py-4 text-slate-500">
                  {formatFecha(venta.fechaCreacion)}
                </td>

                <td className="py-4 text-slate-500">
                  {metodoPagoLabels[venta.metodoPago] || venta.metodoPago}
                </td>

                <td className="py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${venta.tipoPago === "CANCELADO"
                      ? "bg-emerald-100 text-emerald-700"
                      : venta.tipoPago === "ABONO"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-slate-200 text-slate-700"
                      }`}
                  >
                    {tipoPagoLabels[venta.tipoPago] || venta.tipoPago}
                  </span>
                </td>

                <td className="py-4 text-slate-700">
                  S/ {Number(venta.cantidadPagada ?? 0).toFixed(2)}
                </td>

                <td className="py-4 font-semibold text-red-600">
                  S/ {Number(venta.saldoPendiente ?? 0).toFixed(2)}
                </td>

                <td className="py-4 font-semibold text-slate-900">
                  S/ {Number(venta.totalPagar ?? 0).toFixed(2)}
                </td>

                <td className="py-4">
                  <EstadoCobroBadge estado={venta.estadoCobro} />
                </td>

                <td className="py-4 text-slate-500">
                  {estadoVentaLabels[venta.estadoVenta] || venta.estadoVenta}
                </td>

                <td className="py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onInfo(venta)}
                      className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                    >
                      Info
                    </button>

                    {venta.estadoVenta !== "ENTREGADO" && (
                      <button
                        onClick={() => onEntregar(venta)}
                        className="rounded-xl bg-emerald-600 px-4 py-2 text-white font-semibold hover:bg-emerald-700"
                      >
                        Entregar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {ventas.length === 0 && (
          <div className="py-10 text-center text-slate-500">
            No hay ventas registradas
          </div>
        )}
      </div>
    </div>
  )
}