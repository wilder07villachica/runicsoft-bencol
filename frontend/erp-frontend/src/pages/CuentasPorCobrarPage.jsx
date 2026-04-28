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
    <div className="min-h-screen bg-slate-100">
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Topbar />

          <section className="mt-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Cuentas por cobrar
              </h2>
              <p className="text-slate-500">
                Gestión financiera de ventas pendientes, abonos y clientes morosos.
              </p>
            </div>

            {loading ? (
              <div className="rounded-3xl bg-white p-10 text-center shadow-sm border border-slate-200 text-slate-500">
                Cargando cuentas por cobrar...
              </div>
            ) : error ? (
              <div className="rounded-3xl bg-red-50 p-10 text-center shadow-sm border border-red-200 text-red-600">
                {error}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <ResumenCard titulo="Total vendido" valor={resumen.total} />
                  <ResumenCard titulo="Total pagado" valor={resumen.pagado} />
                  <ResumenCard titulo="Saldo pendiente" valor={resumen.pendiente} />
                  <ResumenCard titulo="Morosos" valor={resumen.morosos} simple />
                </div>

                <div className="rounded-3xl bg-white p-4 shadow-sm border border-slate-200">
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="text-sm font-medium text-slate-700">
                      Estado:
                    </label>

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
                </div>

                <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200 overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="text-left text-sm text-slate-500 border-b">
                        <th className="p-3">Venta</th>
                        <th className="p-3">Cliente</th>
                        <th className="p-3">Total</th>
                        <th className="p-3">Pagado</th>
                        <th className="p-3">Pendiente</th>
                        <th className="p-3">Vencimiento</th>
                        <th className="p-3">Estado</th>
                        <th className="p-3">Condición</th>
                        <th className="p-3">Acciones</th>
                      </tr>
                    </thead>

                    <tbody>
                      {cuentas.length === 0 ? (
                        <tr>
                          <td className="p-3 text-slate-500" colSpan="9">
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
                            <tr key={cuenta.id} className="border-b last:border-0">
                              <td className="p-3 font-medium text-slate-900">
                                #{cuenta.ventaId}
                              </td>
                              <td className="p-3 text-slate-700">
                                {cuenta.clienteNombre}
                              </td>
                              <td className="p-3 text-slate-700">
                                S/ {Number(cuenta.montoTotal).toFixed(2)}
                              </td>
                              <td className="p-3 text-slate-700">
                                S/ {Number(cuenta.montoPagado).toFixed(2)}
                              </td>
                              <td className="p-3 font-bold text-slate-900">
                                S/ {Number(cuenta.saldoPendiente).toFixed(2)}
                              </td>
                              <td className="p-3 text-slate-700">
                                {cuenta.fechaVencimiento || "-"}
                              </td>
                              <td className="p-3">
                                <EstadoBadge estado={cuenta.estado} />
                              </td>
                              <td className="p-3">
                                {moroso ? (
                                  <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-600">
                                    Moroso
                                  </span>
                                ) : (
                                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-600">
                                    Al día
                                  </span>
                                )}
                              </td>
                              <td className="p-3">
                                <div className="flex gap-2">
                                  {cuenta.estado !== "PAGADA" && (
                                    <button
                                      onClick={() => abrirAbono(cuenta)}
                                      className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                                    >
                                      Abonar
                                    </button>
                                  )}

                                  {Number(cuenta.saldoPendiente) <= 0 &&
                                    cuenta.estado !== "PAGADA" && (
                                      <button
                                        onClick={() => marcarPagada(cuenta)}
                                        className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700"
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
              </>
            )}
          </section>
        </main>
      </div>

      {cuentaSeleccionada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl space-y-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Registrar abono
              </h2>
              <p className="text-slate-500">
                Venta #{cuentaSeleccionada.ventaId} · {cuentaSeleccionada.clienteNombre}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-100 p-4">
              <p className="text-sm text-slate-500">Saldo pendiente</p>
              <p className="text-2xl font-bold text-slate-900">
                S/ {Number(cuentaSeleccionada.saldoPendiente).toFixed(2)}
              </p>
            </div>

            <input
              type="number"
              placeholder="ID Caja"
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
                className="rounded-2xl border border-slate-200 px-5 py-3 font-medium text-slate-700"
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
      )}
    </div>
  )
}

function ResumenCard({ titulo, valor, simple = false }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
      <p className="text-sm text-slate-500">{titulo}</p>
      <h3 className="mt-2 text-2xl font-bold text-slate-900">
        {simple ? valor : `S/ ${Number(valor).toFixed(2)}`}
      </h3>
    </div>
  )
}

function EstadoBadge({ estado }) {
  const styles = {
    PENDIENTE: "bg-yellow-100 text-yellow-700",
    PARCIAL: "bg-blue-100 text-blue-700",
    PAGADA: "bg-emerald-100 text-emerald-700",
  }

  return (
    <span
      className={`rounded-full px-3 py-1 text-sm font-medium ${
        styles[estado] || "bg-slate-100 text-slate-700"
      }`}
    >
      {estado}
    </span>
  )
}