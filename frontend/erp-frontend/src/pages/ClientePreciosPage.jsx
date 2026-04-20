import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Sidebar from "../components/layout/Sidebar"
import Topbar from "../components/layout/Topbar"
import PrecioTable from "../components/precios/PrecioTable"
import PrecioFormModal from "../components/precios/PrecioFormModal"
import { getClienteById } from "../services/clienteService"
import { getProductos } from "../services/productoService"
import {
  getPreciosByCliente,
  createPrecio,
  updatePrecio,
  deletePrecio,
} from "../services/precioService"

const categoriaLabels = {
  DISTRIBUIDOR: "Distribuidor",
  CONSUMIDOR_FINAL: "Consumidor final",
  CORPORATIVO: "Corporativo",
}

export default function ClientePreciosPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [cliente, setCliente] = useState(null)
  const [productos, setProductos] = useState([])
  const [precios, setPrecios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [openModal, setOpenModal] = useState(false)
  const [precioEditando, setPrecioEditando] = useState(null)

  const cargarTodo = async () => {
    try {
      setLoading(true)
      setError("")

      const [clienteData, productosData, preciosData] = await Promise.all([
        getClienteById(id),
        getProductos(),
        getPreciosByCliente(id),
      ])

      setCliente(clienteData)
      setProductos(productosData)
      setPrecios(preciosData)
    } catch (err) {
      console.error(err)
      setError("No se pudo cargar la información de precios del cliente")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!id || id === "undefined") {
      setError("ID de cliente inválido")
      setLoading(false)
      return
    }

    cargarTodo()
  }, [id])

  const handleNuevo = () => {
    setPrecioEditando(null)
    setOpenModal(true)
  }

  const handleEditar = (precio) => {
    setPrecioEditando(precio)
    setOpenModal(true)
  }

  const handleGuardar = async (form) => {
    try {
      const payload = {
        ...form,
        clienteId: Number(id),
      }

      if (precioEditando) {
        await updatePrecio(precioEditando.id, payload)
      } else {
        await createPrecio(payload)
      }

      setOpenModal(false)
      setPrecioEditando(null)
      await cargarTodo()
    } catch (err) {
      console.error(err)
      alert(
        typeof err?.response?.data === "string"
          ? err.response.data
          : err?.response?.data?.message || "Ocurrió un error al guardar"
      )
    }
  }

  const handleEliminar = async (precio) => {
    const confirmar = window.confirm("¿Deseas eliminar este precio?")
    if (!confirmar) return

    try {
      await deletePrecio(precio.id)
      await cargarTodo()
    } catch (err) {
      console.error(err)
      alert("No se pudo eliminar el precio")
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
                <button
                  onClick={() => navigate("/clientes")}
                  className="mb-3 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                >
                  Volver a clientes
                </button>

                <h2 className="text-2xl font-bold text-slate-900">
                  Precios por cliente
                </h2>

                {cliente && (
                  <p className="text-slate-500">
                    {cliente.nombre} · {categoriaLabels[cliente.categoria] || cliente.categoria}
                  </p>
                )}
              </div>

              <button
                onClick={handleNuevo}
                className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-500 px-5 py-3 font-medium text-white shadow-lg"
              >
                Nuevo precio
              </button>
            </div>

            {cliente && (
              <div className="mb-6 rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">Cliente</h3>
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm text-slate-500">Nombre</p>
                    <p className="font-medium text-slate-900">{cliente.nombre}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Correo</p>
                    <p className="font-medium text-slate-900">{cliente.correo || "No registrado"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Teléfono</p>
                    <p className="font-medium text-slate-900">{cliente.telefono || "No registrado"}</p>
                  </div>
                </div>
              </div>
            )}

            {loading ? (
              <div className="rounded-3xl bg-white p-10 text-center shadow-sm border border-slate-200 text-slate-500">
                Cargando precios...
              </div>
            ) : error ? (
              <div className="rounded-3xl bg-red-50 p-10 text-center shadow-sm border border-red-200 text-red-600">
                {error}
              </div>
            ) : (
              <PrecioTable
                precios={precios}
                onEdit={handleEditar}
                onDelete={handleEliminar}
              />
            )}
          </section>
        </main>
      </div>

      <PrecioFormModal
        open={openModal}
        onClose={() => {
          setOpenModal(false)
          setPrecioEditando(null)
        }}
        onSubmit={handleGuardar}
        precioEditando={precioEditando}
        productos={productos}
      />
    </div>
  )
}