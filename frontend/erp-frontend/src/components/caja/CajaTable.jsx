function formatMoney(value) {
  return `S/ ${Number(value ?? 0).toFixed(2)}`
}

function formatFecha(fecha) {
  if (!fecha) return "-"
  return new Date(fecha).toLocaleString()
}

export default function CajaTable({
  cajas,
  onEdit,
  onActivar,
  onDesactivar,
  onPrincipal,
  onVerMovimientos,
}) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-slate-900">Cajas</h3>
        <p className="text-sm text-slate-500">
          Administración de cajas del sistema
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="pb-3">Nombre</th>
              <th className="pb-3">Descripción</th>
              <th className="pb-3">Saldo</th>
              <th className="pb-3">Activa</th>
              <th className="pb-3">Principal</th>
              <th className="pb-3">Fecha</th>
              <th className="pb-3">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {cajas.map((caja) => (
              <tr key={caja.id} className="border-b border-slate-100">
                <td className="py-4 font-medium text-slate-800">{caja.nombre}</td>
                <td className="py-4 text-slate-500">{caja.descripcion || "-"}</td>
                <td className="py-4 font-semibold text-slate-900">
                  {formatMoney(caja.saldoActual)}
                </td>
                <td className="py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      caja.activa
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {caja.activa ? "Activa" : "Inactiva"}
                  </span>
                </td>
                <td className="py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      caja.principal
                        ? "bg-violet-100 text-violet-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {caja.principal ? "Sí" : "No"}
                  </span>
                </td>
                <td className="py-4 text-slate-500">{formatFecha(caja.fechaCreacion)}</td>
                <td className="py-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => onEdit(caja)}
                      className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                    >
                      Editar
                    </button>

                    {caja.activa ? (
                      <button
                        onClick={() => onDesactivar(caja)}
                        disabled={caja.principal}
                        className={`rounded-xl px-3 py-2 text-sm font-medium ${
                          caja.principal
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                            : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                        }`}
                      >
                        Desactivar
                      </button>
                    ) : (
                      <button
                        onClick={() => onActivar(caja)}
                        className="rounded-xl bg-emerald-100 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-200"
                      >
                        Activar
                      </button>
                    )}

                    <button
                      onClick={() => onPrincipal(caja)}
                      disabled={caja.principal}
                      className={`rounded-xl px-3 py-2 text-sm font-medium ${
                        caja.principal
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                          : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                      }`}
                    >
                      Principal
                    </button>

                    <button
                      onClick={() => onVerMovimientos(caja)}
                      className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
                    >
                      Movimientos
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {cajas.length === 0 && (
          <div className="py-10 text-center text-slate-500">
            No hay cajas registradas
          </div>
        )}
      </div>
    </div>
  )
}