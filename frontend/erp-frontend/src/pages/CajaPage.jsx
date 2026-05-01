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
    try {
      const cajasData = await getCajas()
      setCajas(cajasData || [])
    } catch (err) {
      console.error("Error cargando cajas:", err)
      setCajas([])
    }

    try {
      const principalData = await getCajaPrincipal()
      setPrincipal(principalData)
    } catch (err) {
      console.warn("No hay caja principal todavía")
      setPrincipal(null)
    }
  }

  const cargarMovimientos = async (cajaId = "") => {
    try {
      const movimientosData = cajaId
        ? await getMovimientosByCaja(cajaId)
        : await getMovimientosCaja()

      setMovimientos(movimientosData || [])
    } catch (err) {
      console.error("Error cargando movimientos:", err)
      setMovimientos([])
    }
  }

  const cargarTodo = async (cajaId = filtroCajaId) => {
    setLoading(true)
    setError("")

    await cargarCajas()
    await cargarMovimientos(cajaId)

    setLoading(false)
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

  // 🔥 FIX AQUI
  const handleIngreso = async (payload) => {
    try {
      await registrarIngresoManual({
        ...payload,
        tipoMovimiento: "INGRESO",
      })

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

  // 🔥 FIX AQUI
  const handleEgreso = async (payload) => {
    try {
      await registrarEgresoManual({
        ...payload,
        tipoMovimiento: "EGRESO",
      })

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
      alert("No se pudo activar la caja")
    }
  }

  const handleDesactivar = async (caja) => {
    try {
      await desactivarCaja(caja.id)
      await cargarTodo()
    } catch (err) {
      console.error(err)
      alert("No se pudo desactivar la caja")
    }
  }

  const handlePrincipal = async (caja) => {
    try {
      await marcarCajaPrincipal(caja.id)
      await cargarTodo()
    } catch (err) {
      console.error(err)
      alert("No se pudo marcar como principal")
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
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Gestión de caja
                </h2>
              </div>

              <div className="flex gap-2">
                <button type="button" onClick={() => setOpenCajaModal(true)}
                  className="bg-violet-600 text-white px-5 py-3 rounded-2xl">
                  Nueva caja
                </button>

                <button type="button" onClick={() => setOpenIngresoModal(true)}
                  className="bg-emerald-600 text-white px-5 py-3 rounded-2xl">
                  Ingreso manual
                </button>

                <button type="button" onClick={() => setOpenEgresoModal(true)}
                  className="bg-red-600 text-white px-5 py-3 rounded-2xl">
                  Egreso manual
                </button>
              </div>
            </div>

            {loading ? (
              <p>Cargando...</p>
            ) : (
              <>
                <CajaResumenCards cajas={cajas} principal={principal} />
                <CajaTable
                  cajas={cajas}
                  principal={principal}
                  onEdit={(c) => {
                    setCajaEditando(c)
                    setOpenCajaModal(true)
                  }}
                  onActivar={handleActivar}
                  onDesactivar={handleDesactivar}
                  onPrincipal={handlePrincipal}
                  onVerMovimientos={handleVerMovimientosCaja}
                />
                <MovimientoCajaTable movimientos={movimientos} />
              </>
            )}

          </div>

          {openCajaModal && (
            <CajaFormModal
              onClose={() => setOpenCajaModal(false)}
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