import {
  LayoutDashboard,
  Users,
  Boxes,
  ShoppingCart,
  Landmark,
  Wallet,
  Settings,
} from "lucide-react"
import { NavLink } from "react-router-dom"

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  { label: "Clientes", icon: Users, to: "/clientes" },
  { label: "Productos", icon: Boxes, to: "/productos" },
  { label: "Ventas", icon: ShoppingCart, to: "/ventas" },
  { label: "Finanzas", icon: Landmark, to: "/cuentas-por-cobrar" },
  { label: "Caja", icon: Wallet, to: "/caja" },
  { label: "Configuración", icon: Settings, to: "/configuracion", disabled: true },
]

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex w-60 min-w-60 max-w-60 shrink-0 min-h-screen flex-col bg-slate-950 text-white">
      <div className="px-5 py-5 border-b border-white/10">
        <h1 className="text-2xl font-bold tracking-tight">ERP</h1>
        <p className="text-xs text-slate-400 truncate">
          Clientes · Productos · Ventas · Finanzas
        </p>
      </div>

      <nav className="px-3 py-5 space-y-2 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon

          if (item.disabled) {
            return (
              <div
                key={item.label}
                className="w-full flex items-center gap-3 rounded-2xl px-3 py-2.5 opacity-40 bg-white/5 cursor-not-allowed"
              >
                <Icon size={18} className="shrink-0" />
                <span className="font-medium truncate">{item.label}</span>
              </div>
            )
          }

          return (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 rounded-2xl px-3 py-2.5 transition ${
                  isActive
                    ? "bg-gradient-to-r from-violet-600 to-indigo-500 shadow-lg"
                    : "hover:bg-white/8"
                }`
              }
            >
              <Icon size={18} className="shrink-0" />
              <span className="font-medium truncate">{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="p-3 border-t border-white/10">
        <div className="rounded-2xl bg-white/5 p-3">
          <p className="text-xs text-slate-300">Empresa actual</p>
          <p className="font-semibold text-sm truncate">Runicsoft ERP Demo</p>
        </div>
      </div>
    </aside>
  )
}