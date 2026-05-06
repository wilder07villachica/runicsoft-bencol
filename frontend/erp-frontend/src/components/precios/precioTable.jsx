const tipoProductoLabels = {
  BIDON_20_LITROS: "Bidón 20 Litros",
  BOTELLA_650_MILILITROS: "Botella 650 Mililitros",
  BOTELLA_1_LITRO: "Botella 1 Litro",
  BOTELLA_2_5_LITROS: "Botella 2.5 Litros",
}

const tipoPrecioLabels = {
  POR_MAYOR: "Por mayor",
  POR_MENOR: "Por menor",
}

export default function PrecioTable({ precios, onEdit, onDelete }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-slate-900">Precios especiales</h3>
        <p className="text-sm text-slate-500">
          Configuración por cliente y producto
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="pb-3">Producto</th>
              <th className="pb-3">Tipo precio</th>
              <th className="pb-3">Cantidad mínima</th>
              <th className="pb-3">Precio</th>
              <th className="pb-3">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {precios.map((precio, index) => (
              <tr key={`${precio.id}-${index}`} className="border-b border-slate-100">
                <td className="py-4 text-slate-700">
                  {tipoProductoLabels[precio.tipoProducto] || precio.tipoProducto}
                </td>
                <td className="py-4 text-slate-700">
                  {tipoPrecioLabels[precio.tipoPrecio] || precio.tipoPrecio}
                </td>
                <td className="py-4 text-slate-700">{precio.cantidadMinima}</td>
                <td className="py-4 font-semibold text-slate-900">
                  S/ {Number(precio.precio).toFixed(2)}
                </td>
                <td className="py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(precio)}
                      className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onDelete(precio)}
                      className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {precios.length === 0 && (
          <div className="py-10 text-center text-slate-500">
            No hay precios registrados para este cliente
          </div>
        )}
      </div>
    </div>
  )
}