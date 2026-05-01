import { useEffect, useState } from "react"
import Sidebar from "../components/layout/Sidebar"
import Topbar from "../components/layout/Topbar"
import CajaResumenCards from "../components/caja/CajaResumenCards"
import CajaTable from "../components/caja/CajaTable"
import MovimientoCajaTable from "../components/caja/MovimientoCajaTable"
import CajaFormModal from "../components/caja/CajaFormModal"
import MovimientoIngresoModal from "../components/caja/MovimientoIngresoModal"
import MovimientoEgresoModal from "../components/caja/MovimientoEgresoModal"
import {
  getCajas,
  getCajaPrincipal,
  createCaja,
  updateCaja,
  activarCaja,
  desactivarCaja,
  marcarCajaPrincipal,
} from "../services/cajaService"
import {
  getMovimientosCaja,
  getMovimientosByCaja,
  registrarIngresoManual,
  registrarEgresoManual,
} from "../services/movimientoCajaService"

export default function CajaPage() {
  const [cajas, setCajas] = useState([])
  const [principal, setPrincipal] = useState(null)
  const [movimientos, setMovimientos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [cajaEditando, setCajaEditando] = useState(null)
  const [openCajaModal, setOpenCajaModal] = useState(false)
  const [openIngresoModal, setOpenIngresoModal] = useState(false)
  const [openEgresoModal, setOpenEgresoModal] = useState(false)

  const [filtroCajaId, setFiltroCajaId] = useState("")
  const [cajaPreseleccionada, setCajaPreseleccionada] = useState(null)

  const cargarCajas = async () => {
    const cajasData = await getCajas()
    setCajas(cajasData)

    try {
      const principalData = await getCajaPrincipal()
      setPrincipal(principalData)
    } catch {
      setPrincipal(null)
    }
  }

  const cargarMovimientos = async (cajaId = "") => {
    const movimientosData = cajaId
      ? await getMovimientosByCaja(cajaId)
      : await getMovimientosCaja()

    setMovimientos(movimientosData)
  }

  const cargarTodo = async (cajaId = filtroCajaId) => {
    try {
      setLoading(true)
      setError("")
      await Promise.all([cargarCajas(), cargarMovimientos(cajaId)])
    } catch (err) {
      console.error(err)
      setError("No se pudo cargar la información de caja")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarTodo()
  }, [])

  const handleGuardarCaja = async (payload) => {
    try {
      if (cajaEditando) {
        await updateCaja(cajaEditando.id, payload)
      } else {
        await createCaja(payload)
      }

      setOpenCajaModal(false)
      setCajaEditando(null)
      await cargarTodo()
    } catch (err) {
      console.error(err)
      alert(
        typeof err?.response?.data === "string"
          ? err.response.data
          : err?.response?.data?.message || "No se pudo guardar la caja"
      )
    }
  }

  const handleIngreso = async (payload) => {
    try {
      await registrarIngresoManual(payload)
      setOpenIngresoModal(false)
      await cargarTodo(filtroCajaId)
    } catch (err) {
      console.error(err)
      alert(
        typeof err?.response?.data === "string"
          ? err.response.data
          : err?.response?.data?.message || "No se pudo registrar el ingreso"
      )
    }
  }

  const handleEgreso = async (payload) => {
    try {
      await registrarEgresoManual(payload)
      setOpenEgresoModal(false)
      await cargarTodo(filtroCajaId)
    } catch (err) {
      console.error(err)
      alert(
        typeof err?.response?.data === "string"
          ? err.response.data
          : err?.response?.data?.message || "No se pudo registrar el egreso"
      )
    }
  }

  const handleActivar = async (caja) => {
    try {
      await activarCaja(caja.id)
      await cargarTodo()
    } catch (err) {
      console.error(err)
      alert(
        typeof err?.response?.data === "string"
          ? err.response.data
          : "No se pudo activar la caja"
      )
    }
  }

  const handleDesactivar = async (caja) => {
    try {
      await desactivarCaja(caja.id)
      await cargarTodo()
    } catch (err) {
      console.error(err)
      alert(
        typeof err?.response?.data === "string"
          ? err.response.data
          : "No se pudo desactivar la caja"
      )
    }
  }

  const handlePrincipal = async (caja) => {
    try {
      await marcarCajaPrincipal(caja.id)
      await cargarTodo()
    } catch (err) {
      console.error(err)
      alert(
        typeof err?.response?.data === "string"
          ? err.response.data
          : "No se pudo marcar como principal"
      )
    }
  }

  const handleVerMovimientosCaja = async (caja) => {
    setFiltroCajaId(String(caja.id))
    setCajaPreseleccionada(caja.id)
    await cargarMovimientos(caja.id)
  }

  const handleFiltrarMovimientos = async (e) => {
    const value = e.target.value
    setFiltroCajaId(value)
    setCajaPreseleccionada(value ? Number(value) : null)
    await cargarMovimientos(value)
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
                  Gestión de caja
                </h2>
                <p className="mt-1 text-slate-500">
                  Administra cajas y movimientos financieros
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setCajaEditando(null)
                    setOpenCajaModal(true)
                  }}
                  className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-500 px-5 py-3 font-medium text-white shadow-lg"
                >
                  Nueva caja
                </button>

                <button
                  onClick={() => setOpenIngresoModal(true)}
                  className="rounded-2xl bg-emerald-600 px-5 py-3 font-medium text-white shadow-lg"
                >
                  Ingreso manual
                </button>

                <button
                  onClick={() => setOpenEgresoModal(true)}
                  className="rounded-2xl bg-red-600 px-5 py-3 font-medium text-white shadow-lg"
                >
                  Egreso manual
                </button>
              </div>
            </div>

            {loading ? (
              <p className="py-8 text-center text-slate-500">
                Cargando caja...
              </p>
            ) : error ? (
              <p className="py-8 text-center text-red-500">{error}</p>
            ) : (
              <>
                <div className="mb-6">
                  <CajaResumenCards cajas={cajas} principal={principal} />
                </div>

                <div className="mb-8 w-full overflow-x-auto">
                  <CajaTable
                    cajas={cajas}
                    principal={principal}
                    onEditar={(caja) => {
                      setCajaEditando(caja)
                      setOpenCajaModal(true)
                    }}
                    onActivar={handleActivar}
                    onDesactivar={handleDesactivar}
                    onPrincipal={handlePrincipal}
                    onVerMovimientos={handleVerMovimientosCaja}
                  />
                </div>

                <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <h3 className="text-xl font-bold text-slate-900">
                    Movimientos de caja
                  </h3>

                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-slate-600">
                      Filtrar movimientos por caja:
                    </label>

                    <select
                      value={filtroCajaId}
                      onChange={handleFiltrarMovimientos}
                      className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
                    >
                      <option value="">Todas las cajas</option>
                      {cajas.map((caja) => (
                        <option key={caja.id} value={caja.id}>
                          {caja.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="w-full overflow-x-auto">
                  <MovimientoCajaTable movimientos={movimientos} />
                </div>
              </>
            )}
          </div>

          {openCajaModal && (
            <CajaFormModal
              onClose={() => {
                setOpenCajaModal(false)
                setCajaEditando(null)
              }}
              onSubmit={handleGuardarCaja}
              cajaEditando={cajaEditando}
            />
          )}

          {openIngresoModal && (
            <MovimientoIngresoModal
              onClose={() => setOpenIngresoModal(false)}
              onSubmit={handleIngreso}
              cajas={cajas}
              cajaPreseleccionada={cajaPreseleccionada}
            />
          )}

          {openEgresoModal && (
            <MovimientoEgresoModal
              onClose={() => setOpenEgresoModal(false)}
              onSubmit={handleEgreso}
              cajas={cajas}
              cajaPreseleccionada={cajaPreseleccionada}
            />
          )}
        </main>
      </div>
    </div>
  )
}