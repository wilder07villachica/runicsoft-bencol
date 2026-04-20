import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Trash2 } from "lucide-react"
import Sidebar from "../components/layout/Sidebar"
import Topbar from "../components/layout/Topbar"
import { getClientes } from "../services/clienteService"
import { getProductos } from "../services/productoService"
import { createVenta } from "../services/ventaService"
import { getCajas } from "../services/cajaService"

const metodoPagoLabels = {
  EFECTIVO: "Efectivo",
  TRANSFERENCIA: "Transferencia",
  YAPE_PLIN: "Yape / Plin",
}

const tipoProductoLabels = {
  BIDON_20_LITROS: "Bidón 20 Litros",
  BOTELLA_650_MILILITROS: "Botella 650 Mililitros",
  BOTELLA_1_LITRO: "Botella 1 Litro",
  BOTELLA_2_5_LITROS: "Botella 2.5 Litros",
}

const initialForm = {
  clienteId: "",
  cajaId: "",
  cantidadPagada: "",
  metodoPago: "EFECTIVO",
  detalleVentas: [{ productoId: "", cantidad: 1 }],
}

export default function NuevaVentaPage() {
  const navigate = useNavigate()

  const [clientes, setClientes] = useState([])
  const [productos, setProductos] = useState([])
  const [cajas, setCajas] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(initialForm)

  useEffect(() => {
    const cargar = async () => {
      try {
        const [clientesData, productosData, cajasData] = await Promise.all([
          getClientes(),
          getProductos(),
          getCajas(),
        ])

        setClientes(clientesData)
        setProductos(productosData)
        setCajas(cajasData)
      } catch (error) {
        console.error(error)
        alert("No se pudieron cargar clientes, productos y cajas")
      } finally {
        setLoading(false)
      }
    }

    cargar()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleDetalleChange = (index, field, value) => {
    const nuevos = [...form.detalleVentas]
    nuevos[index] = {
      ...nuevos[index],
      [field]: value,
    }

    setForm((prev) => ({
      ...prev,
      detalleVentas: nuevos,
    }))
  }

  const agregarDetalle = () => {
    setForm((prev) => ({
      ...prev,
      detalleVentas: [...prev.detalleVentas, { productoId: "", cantidad: 1 }],
    }))
  }

  const eliminarDetalle = (index) => {
    if (form.detalleVentas.length === 1) return

    setForm((prev) => ({
      ...prev,
      detalleVentas: prev.detalleVentas.filter((_, i) => i !== index),
    }))
  }

  const handleGuardar = async (e) => {
    e.preventDefault()

    if (!form.clienteId) {
      alert("Seleccione un cliente")
      return
    }

    if (!form.cajaId) {
      alert("Seleccione una caja")
      return
    }

    if (!form.detalleVentas.length) {
      alert("Debe agregar al menos un producto")
      return
    }

    const hayDetalleInvalido = form.detalleVentas.some(
      (detalle) =>
        !detalle.productoId ||
        !detalle.cantidad ||
        Number(detalle.cantidad) <= 0
    )

    if (hayDetalleInvalido) {
      alert("Complete correctamente los productos y cantidades")
      return
    }

    const payload = {
      clienteId: Number(form.clienteId),
      cajaId: Number(form.cajaId),
      cantidadPagada:
        form.cantidadPagada === "" ? 0 : Number(form.cantidadPagada),
      metodoPago: form.metodoPago,
      detalleVentas: form.detalleVentas.map((detalle) => ({
        productoId: Number(detalle.productoId),
        cantidad: Number(detalle.cantidad),
      })),
    }

    try {
      await createVenta(payload)
      navigate("/ventas")
    } catch (err) {
      console.error(err)
      alert(
        typeof err?.response?.data === "string"
          ? err.response.data
          : err?.response?.data?.message || "No se pudo registrar la venta"
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
                <button
                  onClick={() => navigate("/ventas")}
                  className="mb-3 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                >
                  Volver a ventas
                </button>

                <h2 className="text-2xl font-bold text-slate-900">
                  Nueva venta
                </h2>
                <p className="text-slate-500">
                  Registra una nueva operación
                </p>
              </div>
            </div>

            {loading ? (
              <div className="rounded-3xl bg-white p-10 text-center shadow-sm border border-slate-200 text-slate-500">
                Cargando datos...
              </div>
            ) : (
              <form onSubmit={handleGuardar} className="space-y-6">
                <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
                  <h3 className="mb-4 text-lg font-semibold text-slate-900">
                    Datos generales
                  </h3>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Cliente
                      </label>
                      <select
                        name="clienteId"
                        value={form.clienteId}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
                        required
                      >
                        <option value="">Seleccione cliente</option>
                        {clientes.map((cliente) => (
                          <option key={cliente.id} value={cliente.id}>
                            {cliente.nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Caja
                      </label>
                      <select
                        name="cajaId"
                        value={form.cajaId}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
                        required
                      >
                        <option value="">Seleccione caja</option>
                        {cajas.map((caja) => (
                          <option key={caja.id} value={caja.id}>
                            {caja.nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Método de pago
                      </label>
                      <select
                        name="metodoPago"
                        value={form.metodoPago}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
                      >
                        {Object.entries(metodoPagoLabels).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Cantidad pagada
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        name="cantidadPagada"
                        value={form.cantidadPagada}
                        onChange={handleChange}
                        placeholder="0.00"
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        Productos
                      </h3>
                      <p className="text-sm text-slate-500">
                        Agrega uno o más productos a la venta
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={agregarDetalle}
                      className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
                    >
                      <Plus size={16} />
                      Agregar
                    </button>
                  </div>

                  <div className="max-h-[420px] overflow-y-auto pr-2 space-y-4">
                    {form.detalleVentas.map((detalle, index) => (
                      <div
                        key={index}
                        className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <p className="text-sm font-medium text-slate-700">
                            Producto #{index + 1}
                          </p>

                          <button
                            type="button"
                            onClick={() => eliminarDetalle(index)}
                            className="rounded-xl bg-red-50 p-2 text-red-600 hover:bg-red-100"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.5fr_0.8fr]">
                          <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                              Producto
                            </label>
                            <select
                              value={detalle.productoId}
                              onChange={(e) =>
                                handleDetalleChange(index, "productoId", e.target.value)
                              }
                              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
                              required
                            >
                              <option value="">Seleccione producto</option>
                              {productos.map((producto) => (
                                <option key={producto.id} value={producto.id}>
                                  {tipoProductoLabels[producto.tipo] || producto.tipo}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                              Cantidad
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={detalle.cantidad}
                              onChange={(e) =>
                                handleDetalleChange(index, "cantidad", e.target.value)
                              }
                              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="sticky bottom-0 z-10 rounded-3xl bg-slate-100/90 backdrop-blur-sm py-3">
                  <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={() => navigate("/ventas")}
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-3 font-medium text-slate-600 hover:bg-slate-50"
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-500 px-5 py-3 font-medium text-white shadow-lg"
                    >
                      Guardar venta
                    </button>
                  </div>
                </div>
              </form>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}