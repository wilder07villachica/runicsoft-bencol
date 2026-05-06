const categoriaLabels = {
  DISTRIBUIDOR: "Distribuidor",
  CONSUMIDOR_FINAL: "Consumidor final",
  CORPORATIVO: "Corporativo",
}

export default function ClienteTable({ clientes, onEdit, onInfo, onPrecios }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Clientes</h3>
          <p className="text-sm text-slate-500">
            Lista general de clientes registrados
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="pb-3">ID</th>
              <th className="pb-3">Nombre</th>
              <th className="pb-3">Dirección</th>
              <th className="pb-3">Categoría</th>
              <th className="pb-3">Estado</th>
              <th className="pb-3">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {clientes.map((cliente, index) => (
              <tr
                key={`${cliente.id ?? "sin-id"}-${index}`}
                className="border-b border-slate-100"
              >
                <td className="py-4 font-medium text-slate-700">#{cliente.id}</td>
                <td className="py-4 text-slate-700">{cliente.nombre}</td>
                <td className="py-4 text-slate-500">{cliente.direccion}</td>
                <td className="py-4 text-slate-500">
                  {categoriaLabels[cliente.categoria] || cliente.categoria}
                </td>
                <td className="py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${cliente.estado === "ACTIVO"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-200 text-slate-700"
                      }`}
                  >
                    {cliente.estado === "ACTIVO" ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onInfo(cliente)}
                      className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                    >
                      Info
                    </button>

                    <button
                      onClick={() => onEdit(cliente)}
                      className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => onPrecios(cliente)}
                      className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
                    >
                      Precios
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {clientes.length === 0 && (
          <div className="py-10 text-center text-slate-500">
            No hay clientes registrados
          </div>
        )}
      </div>
    </div>
  )
}