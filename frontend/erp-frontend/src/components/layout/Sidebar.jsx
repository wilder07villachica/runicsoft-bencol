import {
  LayoutDashboard,
  Users,
  Boxes,
  ShoppingCart,
  Wallet,
  Settings,
} from "lucide-react"
import { NavLink } from "react-router-dom"

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  { label: "Clientes", icon: Users, to: "/clientes" },
  { label: "Productos", icon: Boxes, to: "/productos" },
  { label: "Ventas", icon: ShoppingCart, to: "/ventas" },
  { label: "Caja", icon: Wallet, to: "/caja" },
  { label: "Configuración", icon: Settings, to: "/configuracion", disabled: true },
]

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex w-72 min-h-screen flex-col bg-slate-950 text-white">
      <div className="px-6 py-6 border-b border-white/10">
        <h1 className="text-3xl font-bold tracking-tight">ERP</h1>
        <p className="text-sm text-slate-400">Clientes · Productos · Ventas</p>
      </div>

      <nav className="px-4 py-6 space-y-2 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon

          if (item.disabled) {
            return (
              <div
                key={item.label}
                className="w-full flex items-center gap-3 rounded-2xl px-4 py-3 opacity-40 bg-white/5 cursor-not-allowed"
              >
                <Icon size={18} />
                <span className="font-medium">{item.label}</span>
              </div>
            )
          }

          return (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 rounded-2xl px-4 py-3 transition ${
                  isActive
                    ? "bg-gradient-to-r from-violet-600 to-indigo-500 shadow-lg"
                    : "hover:bg-white/8"
                }`
              }
            >
              <Icon size={18} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="rounded-2xl bg-white/5 p-4">
          <p className="text-sm text-slate-300">Empresa actual</p>
          <p className="font-semibold">Runicsoft ERP Demo</p>
        </div>
      </div>
    </aside>
  )
}