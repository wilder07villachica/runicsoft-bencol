const tipoProductoLabels = {
  BIDON_20_LITROS: "Bidón 20 Litros",
  BOTELLA_650_MILILITROS: "Botella 650 Mililitros",
  BOTELLA_1_LITRO: "Botella 1 Litro",
  BOTELLA_2_5_LITROS: "Botella 2.5 Litros",
}

export default function ProductoTable({ productos, onEdit, onInfo }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-slate-900">Productos</h3>
        <p className="text-sm text-slate-500">
          Lista general de productos registrados
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="pb-3">ID</th>
              <th className="pb-3">Tipo</th>
              <th className="pb-3">Precio</th>
              <th className="pb-3">Estado</th>
              <th className="pb-3">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {productos.map((producto, index) => (
              <tr
                key={`${producto.id ?? "sin-id"}-${index}`}
                className="border-b border-slate-100"
              >
                <td className="py-4 font-medium text-slate-700">#{producto.id}</td>
                <td className="py-4 text-slate-700">
                  {tipoProductoLabels[producto.tipo] || producto.tipo}
                </td>
                <td className="py-4 text-slate-700">
                  S/ {Number(producto.precio).toFixed(2)}
                </td>
                <td className="py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      producto.estado === "ACTIVO"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {producto.estado === "ACTIVO" ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onInfo(producto)}
                      className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                    >
                      Info
                    </button>

                    <button
                      onClick={() => onEdit(producto)}
                      className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                    >
                      Editar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {productos.length === 0 && (
          <div className="py-10 text-center text-slate-500">
            No hay productos registrados
          </div>
        )}
      </div>
    </div>
  )
}