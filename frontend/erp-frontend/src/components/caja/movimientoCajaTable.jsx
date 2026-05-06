const tipoLabels = {
  INGRESO: "Ingreso",
  EGRESO: "Egreso",
}

function formatMoney(value) {
  return `S/ ${Number(value ?? 0).toFixed(2)}`
}

function formatFecha(fecha) {
  if (!fecha) return "-"
  return new Date(fecha).toLocaleString()
}

export default function MovimientoCajaTable({ movimientos }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-slate-900">Movimientos de caja</h3>
        <p className="text-sm text-slate-500">
          Historial de ingresos y egresos
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="pb-3">Fecha</th>
              <th className="pb-3">Caja</th>
              <th className="pb-3">Tipo</th>
              <th className="pb-3">Origen</th>
              <th className="pb-3">Monto</th>
              <th className="pb-3">Método</th>
              <th className="pb-3">Cliente</th>
              <th className="pb-3">Venta</th>
              <th className="pb-3">Referencia</th>
              <th className="pb-3">Observación</th>
            </tr>
          </thead>

          <tbody>
            {movimientos.map((mov) => (
              <tr key={mov.id} className="border-b border-slate-100">
                <td className="py-4 text-slate-500">{formatFecha(mov.fecha)}</td>
                <td className="py-4 text-slate-700">{mov.cajaNombre}</td>
                <td className="py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      mov.tipo === "INGRESO"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {tipoLabels[mov.tipo] || mov.tipo}
                  </span>
                </td>
                <td className="py-4 text-slate-500">{mov.origen}</td>
                <td className="py-4 font-semibold text-slate-900">
                  {formatMoney(mov.monto)}
                </td>
                <td className="py-4 text-slate-500">{mov.metodoPago || "-"}</td>
                <td className="py-4 text-slate-500">{mov.clienteNombre || "-"}</td>
                <td className="py-4 text-slate-500">
                  {mov.ventaId ? `#${mov.ventaId}` : "-"}
                </td>
                <td className="py-4 text-slate-500">{mov.referencia || "-"}</td>
                <td className="py-4 text-slate-500">{mov.observacion || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {movimientos.length === 0 && (
          <div className="py-10 text-center text-slate-500">
            No hay movimientos registrados
          </div>
        )}
      </div>
    </div>
  )
}