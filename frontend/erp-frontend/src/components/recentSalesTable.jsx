export default function RecentSalesTable({ sales }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Últimas ventas</h3>
          <p className="text-sm text-slate-500">
            Resumen reciente de operaciones
          </p>
        </div>
        <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
          Ver todas
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-200">
              <th className="pb-3">ID</th>
              <th className="pb-3">Cliente</th>
              <th className="pb-3">Fecha</th>
              <th className="pb-3">Total</th>
              <th className="pb-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id} className="border-b border-slate-100">
                <td className="py-4 font-medium text-slate-700">#{sale.id}</td>
                <td className="py-4 text-slate-700">{sale.cliente}</td>
                <td className="py-4 text-slate-500">{sale.fecha}</td>
                <td className="py-4 font-semibold text-slate-900">{sale.total}</td>
                <td className="py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      sale.estado === "Pagado"
                        ? "bg-emerald-100 text-emerald-700"
                        : sale.estado === "Pendiente"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-violet-100 text-violet-700"
                    }`}
                  >
                    {sale.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}