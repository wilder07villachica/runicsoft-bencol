import { useEffect, useMemo, useState } from "react"
import Sidebar from "../components/layout/Sidebar"
import Topbar from "../components/layout/Topbar"
import {
  actualizarCuentaPorCobrar,
  listarCuentasPorCobrar,
  registrarAbonoCuentaPorCobrar,
} from "../services/cuentaPorCobrarService"

export default function CuentasPorCobrarPage() {
  const [cuentas, setCuentas] = useState([])
  const [estado, setEstado] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [cuentaSeleccionada, setCuentaSeleccionada] = useState(null)
  const [montoAbono, setMontoAbono] = useState("")
  const [cajaId, setCajaId] = useState("")
  const [metodoPago, setMetodoPago] = useState("EFECTIVO")
  const [referencia, setReferencia] = useState("")
  const [observacion, setObservacion] = useState("")

  const cargarCuentas = async () => {
    try {
      setLoading(true)
      setError("")

      const data = await listarCuentasPorCobrar({
        estado: estado || undefined,
      })

      setCuentas(data)
    } catch (error) {
      console.error(error)
      setError("No se pudo cargar las cuentas por cobrar")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarCuentas()
  }, [estado])

  const resumen = useMemo(() => {
    const total = cuentas.reduce(
      (acc, item) => acc + Number(item.montoTotal || 0),
      0
    )

    const pagado = cuentas.reduce(
      (acc, item) => acc + Number(item.montoPagado || 0),
      0
    )

    const pendiente = cuentas.reduce(
      (acc, item) => acc + Number(item.saldoPendiente || 0),
      0
    )

    const morosos = cuentas.filter((item) => {
      if (!item.fechaVencimiento) return false
      if (item.estado === "PAGADA") return false
      return new Date(item.fechaVencimiento) < new Date()
    }).length

    return { total, pagado, pendiente, morosos }
  }, [cuentas])

  const abrirAbono = (cuenta) => {
    setCuentaSeleccionada(cuenta)
    setMontoAbono("")
    setCajaId("")
    setMetodoPago("EFECTIVO")
    setReferencia("")
    setObservacion("")
  }

  const registrarAbono = async () => {
    if (!cuentaSeleccionada) return

    if (!cajaId) {
      alert("Seleccione o ingrese una caja")
      return
    }

    if (!montoAbono || Number(montoAbono) <= 0) {
      alert("El monto debe ser mayor a cero")
      return
    }

    try {
      await registrarAbonoCuentaPorCobrar(cuentaSeleccionada.id, {
        cajaId: Number(cajaId),
        monto: Number(montoAbono),
        metodoPago,
        referencia,
        observacion,
      })

      setCuentaSeleccionada(null)
      await cargarCuentas()
      alert("Abono registrado correctamente")
    } catch (error) {
      console.error(error)
      alert(error.response?.data?.message || "Error al registrar abono")
    }
  }

  const marcarPagada = async (cuenta) => {
    try {
      await actualizarCuentaPorCobrar(cuenta.id, {
        estado: "PAGADA",
      })

      await cargarCuentas()
    } catch (error) {
      console.error(error)
      alert(error.response?.data?.message || "No se pudo actualizar la cuenta")
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />

        <main className="min-w-0 flex-1 overflow-x-hidden p-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <h2 className="text-2xl font-bold text-slate-900">
                  Cuentas por cobrar
                </h2>
                <p className="mt-1 text-slate-500">
                  Gestión financiera de ventas pendientes, abonos y clientes morosos.
                </p>
              </div>

              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
              >
                <option value="">Todos</option>
                <option value="PENDIENTE">Pendiente</option>
                <option value="PARCIAL">Parcial</option>
                <option value="PAGADA">Pagada</option>
              </select>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
              <ResumenCard titulo="Total" valor={resumen.total} />
              <ResumenCard titulo="Pagado" valor={resumen.pagado} />
              <ResumenCard titulo="Pendiente" valor={resumen.pendiente} />
              <ResumenCard titulo="Morosos" valor={resumen.morosos} simple />
            </div>

            {loading ? (
              <p className="py-8 text-center text-slate-500">
                Cargando cuentas por cobrar...
              </p>
            ) : error ? (
              <p className="py-8 text-center text-red-500">{error}</p>
            ) : (
              <div className="w-full overflow-x-auto rounded-2xl border border-slate-200">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="px-4 py-3">Venta</th>
                      <th className="px-4 py-3">Cliente</th>
                      <th className="px-4 py-3">Total</th>
                      <th className="px-4 py-3">Pagado</th>
                      <th className="px-4 py-3">Pendiente</th>
                      <th className="px-4 py-3">Vencimiento</th>
                      <th className="px-4 py-3">Estado</th>
                      <th className="px-4 py-3">Condición</th>
                      <th className="px-4 py-3">Acciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {cuentas.length === 0 ? (
                      <tr>
                        <td
                          colSpan="9"
                          className="px-4 py-8 text-center text-slate-500"
                        >
                          No hay cuentas por cobrar.
                        </td>
                      </tr>
                    ) : (
                      cuentas.map((cuenta) => {
                        const moroso =
                          cuenta.fechaVencimiento &&
                          cuenta.estado !== "PAGADA" &&
                          new Date(cuenta.fechaVencimiento) < new Date()

                        return (
                          <tr
                            key={cuenta.id}
                            className="border-t border-slate-100"
                          >
                            <td className="px-4 py-4 font-semibold text-slate-900">
                              #{cuenta.ventaId}
                            </td>

                            <td className="px-4 py-4 text-slate-700">
                              {cuenta.clienteNombre}
                            </td>

                            <td className="px-4 py-4 font-semibold text-slate-900">
                              S/ {Number(cuenta.montoTotal).toFixed(2)}
                            </td>

                            <td className="px-4 py-4 text-slate-700">
                              S/ {Number(cuenta.montoPagado).toFixed(2)}
                            </td>

                            <td className="px-4 py-4 font-bold text-red-500">
                              S/ {Number(cuenta.saldoPendiente).toFixed(2)}
                            </td>

                            <td className="px-4 py-4 text-slate-500">
                              {cuenta.fechaVencimiento || "-"}
                            </td>

                            <td className="px-4 py-4">
                              <EstadoBadge estado={cuenta.estado} />
                            </td>

                            <td className="px-4 py-4">
                              {moroso ? (
                                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                                  Moroso
                                </span>
                              ) : (
                                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                                  Al día
                                </span>
                              )}
                            </td>

                            <td className="px-4 py-4">
                              <div className="flex gap-2">
                                {cuenta.estado !== "PAGADA" && (
                                  <button
                                    onClick={() => abrirAbono(cuenta)}
                                    className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
                                  >
                                    Abonar
                                  </button>
                                )}

                                {Number(cuenta.saldoPendiente) <= 0 &&
                                  cuenta.estado !== "PAGADA" && (
                                    <button
                                      onClick={() => marcarPagada(cuenta)}
                                      className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
                                    >
                                      Marcar pagada
                                    </button>
                                  )}
                              </div>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {cuentaSeleccionada && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
              <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
                <h2 className="text-xl font-bold text-slate-900">
                  Registrar abono
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Venta #{cuentaSeleccionada.ventaId} ·{" "}
                  {cuentaSeleccionada.clienteNombre}
                </p>

                <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Saldo pendiente</p>
                  <p className="text-2xl font-bold text-red-500">
                    S/ {Number(cuentaSeleccionada.saldoPendiente).toFixed(2)}
                  </p>
                </div>

                <div className="mt-5 space-y-4">
                  <input
                    type="number"
                    placeholder="Caja ID"
                    value={cajaId}
                    onChange={(e) => setCajaId(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
                  />

                  <input
                    type="number"
                    placeholder="Monto del abono"
                    value={montoAbono}
                    onChange={(e) => setMontoAbono(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
                  />

                  <select
                    value={metodoPago}
                    onChange={(e) => setMetodoPago(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
                  >
                    <option value="EFECTIVO">Efectivo</option>
                    <option value="YAPE">Yape</option>
                    <option value="PLIN">Plin</option>
                    <option value="TRANSFERENCIA">Transferencia</option>
                    <option value="TARJETA">Tarjeta</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Referencia"
                    value={referencia}
                    onChange={(e) => setReferencia(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
                  />

                  <textarea
                    placeholder="Observación"
                    value={observacion}
                    onChange={(e) => setObservacion(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
                  />

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setCuentaSeleccionada(null)}
                      className="rounded-2xl border border-slate-200 px-5 py-3 font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Cancelar
                    </button>

                    <button
                      onClick={registrarAbono}
                      className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-500 px-5 py-3 font-medium text-white shadow-lg"
                    >
                      Guardar abono
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

function ResumenCard({ titulo, valor, simple = false }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm text-slate-500">{titulo}</p>
      <h3 className="mt-2 text-2xl font-bold text-slate-900">
        {simple ? valor : `S/ ${Number(valor).toFixed(2)}`}
      </h3>
    </div>
  )
}

function EstadoBadge({ estado }) {
  const styles = {
    PENDIENTE: "bg-red-100 text-red-700",
    PARCIAL: "bg-blue-100 text-blue-700",
    PAGADA: "bg-emerald-100 text-emerald-700",
  }

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        styles[estado] || "bg-slate-100 text-slate-700"
      }`}
    >
      {estado}
    </span>
  )
}