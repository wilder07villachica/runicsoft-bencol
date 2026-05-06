import { Bell, Search, LogOut } from "lucide-react"
import { useAuth } from "../../context/authContext"

export default function Topbar() {
  const { user, logout } = useAuth()

  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      
      {/* IZQUIERDA */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          ERP Runicsoft
        </h2>
        <p className="text-slate-500">
          {user?.empresaNombre || "Panel general del sistema"}
        </p>
      </div>

      {/* DERECHA */}
      <div className="flex items-center gap-3">
        
        {/* BUSCADOR */}
        <div className="hidden md:flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <Search size={16} className="text-slate-400" />
          <input
            className="outline-none text-sm bg-transparent"
            placeholder="Buscar..."
          />
        </div>

        {/* NOTIFICACIONES */}
        <button className="relative rounded-2xl bg-white p-3 shadow-sm border border-slate-200">
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
            3
          </span>
        </button>

        {/* USUARIO */}
        <div className="hidden md:flex flex-col text-right">
          <span className="text-sm font-semibold text-slate-800">
            {user?.nombre}
          </span>
          <span className="text-xs text-slate-500">
            {user?.correo}
          </span>
        </div>

        {/* LOGOUT */}
        <button
          onClick={logout}
          className="flex items-center gap-2 rounded-2xl bg-red-50 border border-red-200 px-3 py-2 text-red-600 hover:bg-red-100 transition"
        >
          <LogOut size={16} />
          <span className="hidden md:inline text-sm">Salir</span>
        </button>
      </div>
    </header>
  )
}