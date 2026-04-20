import { useEffect, useState } from "react"
import Sidebar from "../components/layout/Sidebar"
import Topbar from "../components/layout/Topbar"
import ProductoTable from "../components/productos/ProductoTable"
import ProductoFormModal from "../components/productos/ProductoFormModal"
import ProductoInfoModal from "../components/productos/ProductoInfoModal"
import {
  getProductos,
  createProducto,
  updateProducto,
} from "../services/productoService"

export default function ProductosPage() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [openModal, setOpenModal] = useState(false)
  const [productoEditando, setProductoEditando] = useState(null)
  const [productoInfo, setProductoInfo] = useState(null)
  const [openInfoModal, setOpenInfoModal] = useState(false)

  const cargarProductos = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await getProductos()
      setProductos(data)
    } catch (err) {
      setError("No se pudieron cargar los productos")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarProductos()
  }, [])

  const handleNuevo = () => {
    setProductoEditando(null)
    setOpenModal(true)
  }

  const handleEditar = (producto) => {
    setProductoEditando(producto)
    setOpenModal(true)
  }

  const handleInfo = (producto) => {
    setProductoInfo(producto)
    setOpenInfoModal(true)
  }

  const handleGuardar = async (form) => {
    try {
      if (productoEditando) {
        await updateProducto(productoEditando.id, form)
      } else {
        await createProducto(form)
      }

      setOpenModal(false)
      setProductoEditando(null)
      await cargarProductos()
    } catch (err) {
      console.error("ERROR COMPLETO:", err)
      console.error("STATUS:", err?.response?.status)
      console.error("DATA:", err?.response?.data)
      console.error("PAYLOAD ENVIADO:", form)

      alert(
        typeof err?.response?.data === "string"
          ? err.response.data
          : err?.response?.data?.message || "Ocurrió un error al guardar"
      )
    }
  }

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
                  Gestión de productos
                </h2>
                <p className="text-slate-500">
                  Crea, visualiza y edita tus productos
                </p>
              </div>

              <button
                onClick={handleNuevo}
                className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-500 px-5 py-3 font-medium text-white shadow-lg"
              >
                Nuevo producto
              </button>
            </div>

            {loading ? (
              <div className="rounded-3xl bg-white p-10 text-center shadow-sm border border-slate-200 text-slate-500">
                Cargando productos...
              </div>
            ) : error ? (
              <div className="rounded-3xl bg-red-50 p-10 text-center shadow-sm border border-red-200 text-red-600">
                {error}
              </div>
            ) : (
              <ProductoTable
                productos={productos}
                onEdit={handleEditar}
                onInfo={handleInfo}
              />
            )}
          </section>
        </main>
      </div>

      <ProductoFormModal
        open={openModal}
        onClose={() => {
          setOpenModal(false)
          setProductoEditando(null)
        }}
        onSubmit={handleGuardar}
        productoEditando={productoEditando}
      />

      <ProductoInfoModal
        open={openInfoModal}
        onClose={() => {
          setOpenInfoModal(false)
          setProductoInfo(null)
        }}
        producto={productoInfo}
      />
    </div>
  )
}