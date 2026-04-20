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
    <div className="min-h-screen bg-slate-100">
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Topbar />

          <section className="mt-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Gestión de caja
                </h2>
                <p className="text-slate-500">
                  Administra cajas y movimientos financieros
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
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
              <div className="rounded-3xl bg-white p-10 text-center shadow-sm border border-slate-200 text-slate-500">
                Cargando caja...
              </div>
            ) : error ? (
              <div className="rounded-3xl bg-red-50 p-10 text-center shadow-sm border border-red-200 text-red-600">
                {error}
              </div>
            ) : (
              <>
                <CajaResumenCards cajas={cajas} principal={principal} />

                <CajaTable
                  cajas={cajas}
                  onEdit={(caja) => {
                    setCajaEditando(caja)
                    setOpenCajaModal(true)
                  }}
                  onActivar={handleActivar}
                  onDesactivar={handleDesactivar}
                  onPrincipal={handlePrincipal}
                  onVerMovimientos={handleVerMovimientosCaja}
                />

                <div className="rounded-3xl bg-white p-4 shadow-sm border border-slate-200">
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="text-sm font-medium text-slate-700">
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

                <MovimientoCajaTable movimientos={movimientos} />
              </>
            )}
          </section>
        </main>
      </div>

      <CajaFormModal
        open={openCajaModal}
        onClose={() => {
          setOpenCajaModal(false)
          setCajaEditando(null)
        }}
        onSubmit={handleGuardarCaja}
        cajaEditando={cajaEditando}
      />

      <MovimientoIngresoModal
        open={openIngresoModal}
        onClose={() => setOpenIngresoModal(false)}
        onSubmit={handleIngreso}
        cajas={cajas}
        cajaPreseleccionada={cajaPreseleccionada}
      />

      <MovimientoEgresoModal
        open={openEgresoModal}
        onClose={() => setOpenEgresoModal(false)}
        onSubmit={handleEgreso}
        cajas={cajas}
        cajaPreseleccionada={cajaPreseleccionada}
      />
    </div>
  )
}