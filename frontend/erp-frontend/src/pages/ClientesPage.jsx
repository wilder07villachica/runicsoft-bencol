import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Sidebar from "../components/layout/Sidebar"
import Topbar from "../components/layout/Topbar"
import ClienteTable from "../components/clientes/ClienteTable"
import ClienteFormModal from "../components/clientes/ClienteFormModal"
import ClienteInfoModal from "../components/clientes/ClienteInfoModal"
import {
  getClientes,
  createCliente,
  updateCliente,
} from "../services/clienteService"

export default function ClientesPage() {
  const navigate = useNavigate()

  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [openModal, setOpenModal] = useState(false)
  const [clienteEditando, setClienteEditando] = useState(null)
  const [clienteInfo, setClienteInfo] = useState(null)
  const [openInfoModal, setOpenInfoModal] = useState(false)
  const [error, setError] = useState("")

  const cargarClientes = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await getClientes()
      setClientes(data)
    } catch (err) {
      setError("No se pudieron cargar los clientes")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarClientes()
  }, [])

  const handleNuevo = () => {
    setClienteEditando(null)
    setOpenModal(true)
  }

  const handleEditar = (cliente) => {
    setClienteEditando(cliente)
    setOpenModal(true)
  }

  const handleInfo = (cliente) => {
    setClienteInfo(cliente)
    setOpenInfoModal(true)
  }

  const handlePrecios = (cliente) => {
  console.log("CLIENTE EN PRECIOS:", cliente)

  if (!cliente?.id) {
    alert("Este cliente no tiene ID válido.")
    return
  }

  navigate(`/clientes/${cliente.id}/precios`)
}

  const handleGuardar = async (form) => {
    try {
      if (clienteEditando) {
        await updateCliente(clienteEditando.id, form)
      } else {
        await createCliente(form)
      }

      setOpenModal(false)
      setClienteEditando(null)
      await cargarClientes()
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
                  Gestión de clientes
                </h2>
                <p className="text-slate-500">
                  Crea, visualiza y edita tus clientes
                </p>
              </div>

              <button
                onClick={handleNuevo}
                className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-500 px-5 py-3 font-medium text-white shadow-lg"
              >
                Nuevo cliente
              </button>
            </div>

            {loading ? (
              <div className="rounded-3xl bg-white p-10 text-center shadow-sm border border-slate-200 text-slate-500">
                Cargando clientes...
              </div>
            ) : error ? (
              <div className="rounded-3xl bg-red-50 p-10 text-center shadow-sm border border-red-200 text-red-600">
                {error}
              </div>
            ) : (
              <ClienteTable
                clientes={clientes}
                onEdit={handleEditar}
                onInfo={handleInfo}
                onPrecios={handlePrecios}
              />
            )}
          </section>
        </main>
      </div>

      <ClienteFormModal
        open={openModal}
        onClose={() => {
          setOpenModal(false)
          setClienteEditando(null)
        }}
        onSubmit={handleGuardar}
        clienteEditando={clienteEditando}
      />

      <ClienteInfoModal
        open={openInfoModal}
        onClose={() => {
          setOpenInfoModal(false)
          setClienteInfo(null)
        }}
        cliente={clienteInfo}
      />
    </div>
  )
}