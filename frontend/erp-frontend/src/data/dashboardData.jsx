export const stats = [
  {
    title: "Clientes Activos",
    value: "128",
    change: "+8 este mes",
    icon: "users",
    gradient: "from-indigo-500 to-blue-500",
  },
  {
    title: "Productos Registrados",
    value: "46",
    change: "+5 nuevos",
    icon: "boxes",
    gradient: "from-emerald-500 to-green-400",
  },
  {
    title: "Ventas del Mes",
    value: "S/ 18,540",
    change: "+12.4%",
    icon: "shopping",
    gradient: "from-violet-500 to-fuchsia-500",
  },
  {
    title: "Tickets Emitidos",
    value: "94",
    change: "hoy 7 ventas",
    icon: "receipt",
    gradient: "from-amber-400 to-orange-400",
  },
]

export const salesTrend = [
  { name: "Ene", ventas: 3200, ingresos: 2600 },
  { name: "Feb", ventas: 4100, ingresos: 3500 },
  { name: "Mar", ventas: 3800, ingresos: 3300 },
  { name: "Abr", ventas: 4700, ingresos: 3900 },
  { name: "May", ventas: 5200, ingresos: 4400 },
  { name: "Jun", ventas: 6100, ingresos: 5000 },
]

export const salesByCategory = [
  { name: "Bidones", value: 45 },
  { name: "Botellas", value: 25 },
  { name: "Accesorios", value: 15 },
  { name: "Otros", value: 15 },
]

export const recentSales = [
  {
    id: 1,
    cliente: "Bodega San Martín",
    fecha: "18/04/2026",
    total: "S/ 220.00",
    estado: "Pagado",
  },
  {
    id: 2,
    cliente: "Rest. El Buen Sabor",
    fecha: "18/04/2026",
    total: "S/ 180.00",
    estado: "Pendiente",
  },
  {
    id: 3,
    cliente: "Minimarket Yuli",
    fecha: "17/04/2026",
    total: "S/ 95.00",
    estado: "Pagado",
  },
  {
    id: 4,
    cliente: "Hotel Plaza Norte",
    fecha: "17/04/2026",
    total: "S/ 310.00",
    estado: "Parcial",
  },
]

export const recentActivity = [
  "Se registró un nuevo cliente: Comercial Rojas",
  "Se creó el producto: Bidón 20L Premium",
  "Venta #104 registrada correctamente",
  "Producto con stock bajo: Botella 625ml",
]

export const alerts = [
  "3 ventas pendientes de pago",
  "2 productos con stock bajo",
  "1 cliente sin correo registrado",
]