import { useEffect, useMemo, useState } from "react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import Sidebar from "../components/layout/Sidebar"
import Topbar from "../components/layout/Topbar"
import { getDashboardData } from "../services/dashboardService"

const DONUT_COLORS = ["#6366F1", "#8B5CF6", "#22C55E", "#F59E0B", "#EF4444"]

function formatMoney(value) {
  return `S/ ${Number(value ?? 0).toFixed(2)}`
}

function formatDate(value) {
  if (!value) return "-"
  return new Date(value).toLocaleString()
}

function getLastMonths(count = 6) {
  const result = []
  const now = new Date()

  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    result.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: d.toLocaleDateString("es-PE", { month: "short" }),
    })
  }

  return result
}

function buildIngresosEgresosChart(movimientos) {
  const months = getLastMonths(6)
  const base = months.map((m) => ({
    mes: m.label,
    key: m.key,
    ingresos: 0,
    egresos: 0,
  }))

  movimientos.forEach((mov) => {
    if (!mov.fecha) return

    const d = new Date(mov.fecha)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    const month = base.find((item) => item.key === key)

    if (!month) return

    if (mov.tipo === "INGRESO") {
      month.ingresos += Number(mov.monto ?? 0)
    } else if (mov.tipo === "EGRESO") {
      month.egresos += Number(mov.monto ?? 0)
    }
  })

  return base.map(({ key, ...rest }) => rest)
}

function buildVentasPorCliente(ventas) {
  const grouped = ventas.reduce((acc, venta) => {
    const key = venta.nombreCliente || "Sin cliente"
    acc[key] = (acc[key] || 0) + Number(venta.totalPagar ?? 0)
    return acc
  }, {})

  return Object.entries(grouped)
    .map(([name, value]) => ({
      name,
      value,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)
}

function StatCard({ title, value, subtitle, gradient }) {
  return (
    <div className={`rounded-3xl p-6 text-white shadow-lg ${gradient}`}>
      <p className="text-sm text-white/80">{title}</p>
      <h3 className="mt-2 text-3xl font-bold">{value}</h3>
      <p className="mt-2 text-sm text-white/80">{subtitle}</p>
    </div>
  )
}

export default function DashboardPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const cargarDashboard = async () => {
      try {
        setLoading(true)
        setError("")
        const result = await getDashboardData()
        setData(result)
      } catch (err) {
        console.error(err)
        setError("No se pudo cargar el dashboard")
      } finally {
        setLoading(false)
      }
    }

    cargarDashboard()
  }, [])

  const resumen = useMemo(() => {
    if (!data) return null

    const ingresosTotales = data.movimientos
      .filter((m) => m.tipo === "INGRESO")
      .reduce((acc, mov) => acc + Number(mov.monto ?? 0), 0)

    const egresosTotales = data.movimientos
      .filter((m) => m.tipo === "EGRESO")
      .reduce((acc, mov) => acc + Number(mov.monto ?? 0), 0)

    const utilidadNeta = ingresosTotales - egresosTotales
    const cajasActivas = data.cajas.filter((caja) => caja.activa).length

    const saldoTotalCajas = data.cajas.reduce(
      (acc, caja) => acc + Number(caja.saldoActual ?? 0),
      0
    )

    const chartData = buildIngresosEgresosChart(data.movimientos)
    const donutData = buildVentasPorCliente(data.ventas)

    const ventasRecientes = [...data.ventas]
      .sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion))
      .slice(0, 5)

    const movimientosRecientes = [...data.movimientos]
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
      .slice(0, 5)

    return {
      ingresosTotales,
      egresosTotales,
      utilidadNeta,
      cajasActivas,
      saldoTotalCajas,
      chartData,
      donutData,
      ventasRecientes,
      movimientosRecientes,
      totalClientes: data.clientes.length,
      totalProductos: data.productos.length,
      totalVentas: data.ventas.length,
      cajaPrincipal: data.cajaPrincipal,
    }
  }, [data])

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Topbar />

          <section className="mt-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
              <p className="text-slate-500">Visión general de tu sistema ERP</p>
            </div>

            {loading ? (
              <div className="rounded-3xl bg-white p-10 text-center shadow-sm border border-slate-200 text-slate-500">
                Cargando dashboard...
              </div>
            ) : error ? (
              <div className="rounded-3xl bg-red-50 p-10 text-center shadow-sm border border-red-200 text-red-600">
                {error}
              </div>
            ) : resumen ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                  <StatCard
                    title="Ingresos Totales"
                    value={formatMoney(resumen.ingresosTotales)}
                    subtitle="Basado en movimientos de caja"
                    gradient="bg-gradient-to-r from-indigo-500 to-blue-500"
                  />
                  <StatCard
                    title="Gastos Totales"
                    value={formatMoney(resumen.egresosTotales)}
                    subtitle="Egresos registrados"
                    gradient="bg-gradient-to-r from-emerald-500 to-green-500"
                  />
                  <StatCard
                    title="Utilidad Neta"
                    value={formatMoney(resumen.utilidadNeta)}
                    subtitle="Ingresos - egresos"
                    gradient="bg-gradient-to-r from-violet-500 to-purple-500"
                  />
                  <StatCard
                    title="Cajas Activas"
                    value={resumen.cajasActivas}
                    subtitle={`Saldo total: ${formatMoney(resumen.saldoTotalCajas)}`}
                    gradient="bg-gradient-to-r from-amber-500 to-orange-400"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                  <div className="xl:col-span-2 rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
                    <div className="mb-5 flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          Ingresos y Egresos por período
                        </h3>
                        <p className="text-sm text-slate-500">
                          Últimos 6 meses según movimientos registrados
                        </p>
                      </div>
                    </div>

                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={resumen.chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                          <XAxis dataKey="mes" stroke="#64748B" />
                          <YAxis stroke="#64748B" />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="ingresos"
                            stroke="#6366F1"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="egresos"
                            stroke="#22C55E"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
                    <div className="mb-5">
                      <h3 className="text-lg font-semibold text-slate-900">
                        Distribución de ventas
                      </h3>
                      <p className="text-sm text-slate-500">
                        Top clientes por ventas
                      </p>
                    </div>

                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={resumen.donutData}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={60}
                            outerRadius={95}
                            paddingAngle={3}
                          >
                            {resumen.donutData.map((entry, index) => (
                              <Cell
                                key={entry.name}
                                fill={DONUT_COLORS[index % DONUT_COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => formatMoney(value)} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="mt-4 space-y-3">
                      {resumen.donutData.map((item, index) => (
                        <div
                          key={item.name}
                          className="flex items-center justify-between text-sm"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className="h-3 w-3 rounded-full"
                              style={{
                                backgroundColor:
                                  DONUT_COLORS[index % DONUT_COLORS.length],
                              }}
                            />
                            <span className="text-slate-700">{item.name}</span>
                          </div>
                          <span className="font-medium text-slate-900">
                            {formatMoney(item.value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                  <div className="xl:col-span-2 rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
                    <div className="mb-5">
                      <h3 className="text-lg font-semibold text-slate-900">
                        Ventas recientes
                      </h3>
                      <p className="text-sm text-slate-500">
                        Últimas ventas registradas
                      </p>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[700px] text-sm">
                        <thead>
                          <tr className="border-b border-slate-200 text-left text-slate-500">
                            <th className="pb-3">ID</th>
                            <th className="pb-3">Cliente</th>
                            <th className="pb-3">Fecha</th>
                            <th className="pb-3">Tipo pago</th>
                            <th className="pb-3">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {resumen.ventasRecientes.map((venta) => (
                            <tr key={venta.id} className="border-b border-slate-100">
                              <td className="py-4 font-medium text-slate-700">
                                #{venta.id}
                              </td>
                              <td className="py-4 text-slate-700">
                                {venta.nombreCliente}
                              </td>
                              <td className="py-4 text-slate-500">
                                {formatDate(venta.fechaCreacion)}
                              </td>
                              <td className="py-4 text-slate-500">
                                {venta.tipoPago}
                              </td>
                              <td className="py-4 font-semibold text-slate-900">
                                {formatMoney(venta.totalPagar)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
                    <div className="mb-5">
                      <h3 className="text-lg font-semibold text-slate-900">
                        Resumen rápido
                      </h3>
                      <p className="text-sm text-slate-500">
                        Indicadores del sistema
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-2xl border border-slate-200 p-4">
                        <p className="text-sm text-slate-500">Clientes</p>
                        <p className="mt-1 text-xl font-bold text-slate-900">
                          {resumen.totalClientes}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 p-4">
                        <p className="text-sm text-slate-500">Productos</p>
                        <p className="mt-1 text-xl font-bold text-slate-900">
                          {resumen.totalProductos}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 p-4">
                        <p className="text-sm text-slate-500">Ventas</p>
                        <p className="mt-1 text-xl font-bold text-slate-900">
                          {resumen.totalVentas}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 p-4">
                        <p className="text-sm text-slate-500">Caja principal</p>
                        <p className="mt-1 font-semibold text-slate-900">
                          {resumen.cajaPrincipal?.nombre || "No definida"}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {formatMoney(resumen.cajaPrincipal?.saldoActual ?? 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
                  <div className="mb-5">
                    <h3 className="text-lg font-semibold text-slate-900">
                      Movimientos recientes
                    </h3>
                    <p className="text-sm text-slate-500">
                      Últimos ingresos y egresos registrados
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {resumen.movimientosRecientes.map((mov) => (
                      <div
                        key={mov.id}
                        className="rounded-2xl border border-slate-200 p-4"
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              mov.tipo === "INGRESO"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {mov.tipo}
                          </span>
                          <span className="text-xs text-slate-500">
                            {mov.cajaNombre}
                          </span>
                        </div>

                        <p className="mt-3 text-lg font-bold text-slate-900">
                          {formatMoney(mov.monto)}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">{mov.origen}</p>
                        <p className="mt-2 text-xs text-slate-400">
                          {formatDate(mov.fecha)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </section>
        </main>
      </div>
    </div>
  )
}