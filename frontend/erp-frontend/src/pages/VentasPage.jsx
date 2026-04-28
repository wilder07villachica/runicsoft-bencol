import { useEffect, useState } from "react"
import Sidebar from "../components/layout/Sidebar"
import Topbar from "../components/layout/Topbar"
import VentaTable from "../components/ventas/VentaTable"
import VentaInfoModal from "../components/ventas/VentaInfoModal"
import { getClientes } from "../services/ClienteService"
import { getProductos } from "../services/ProductoService"
import { getVentas, getVentaById, createVenta } from "../services/ventaService"
import { useNavigate } from "react-router-dom"

export default function VentasPage() {
  const [ventas, setVentas] = useState([])
  const [clientes, setClientes] = useState([])
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [openInfoModal, setOpenInfoModal] = useState(false)
  const [ventaInfo, setVentaInfo] = useState(null)

  const cargarTodo = async () => {
    try {
      setLoading(true)
      setError("")

      const [ventasData, clientesData, productosData] = await Promise.all([
        getVentas(),
        getClientes(),
        getProductos(),
      ])

      setVentas(ventasData)
      setClientes(clientesData)
      setProductos(productosData)
    } catch (err) {
      console.error(err)
      setError("No se pudo cargar la información de ventas")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarTodo()
  }, [])

  useEffect(() => {
    const handleFocus = () => {
      cargarTodo()
    }

    window.addEventListener("focus", handleFocus)

    return () => {
      window.removeEventListener("focus", handleFocus)
    }
  }, [])

  const handleNueva = () => {
    setOpenModal(true)
  }

  const handleGuardar = async (payload) => {
    try {
      await createVenta(payload)
      setOpenModal(false)
      await cargarTodo()
    } catch (err) {
      console.error("ERROR COMPLETO:", err)
      console.error("STATUS:", err?.response?.status)
      console.error("DATA:", err?.response?.data)
      console.error("PAYLOAD ENVIADO:", payload)

      alert(
        typeof err?.response?.data === "string"
          ? err.response.data
          : err?.response?.data?.message || "Ocurrió un error al guardar la venta"
      )
    }
  }

  const handleInfo = async (ventaResumen) => {
    try {
      const venta = await getVentaById(ventaResumen.id)
      setVentaInfo(venta)
      setOpenInfoModal(true)
    } catch (err) {
      console.error(err)
      alert("No se pudo cargar el detalle de la venta")
    }
  }

  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Topbar />

          <section className="mt-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Gestión de ventas
                </h2>
                <p className="text-slate-500">
                  Registra y visualiza las ventas del sistema
                </p>
              </div>

              <button
                onClick={() => navigate("/ventas/nueva")}
                className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-500 px-5 py-3 font-medium text-white shadow-lg"
              >
                Nueva venta
              </button>
            </div>

            {loading ? (
              <div className="rounded-3xl bg-white p-10 text-center shadow-sm border border-slate-200 text-slate-500">
                Cargando ventas...
              </div>
            ) : error ? (
              <div className="rounded-3xl bg-red-50 p-10 text-center shadow-sm border border-red-200 text-red-600">
                {error}
              </div>
            ) : (
              <VentaTable ventas={ventas} onInfo={handleInfo} />
            )}
          </section>
        </main>
      </div>

      <VentaInfoModal
        open={openInfoModal}
        onClose={() => {
          setOpenInfoModal(false)
          setVentaInfo(null)
        }}
        venta={ventaInfo}
      />
    </div>
  )
}