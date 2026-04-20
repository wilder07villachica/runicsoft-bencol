import { Bell, Search } from "lucide-react"

export default function Topbar() {
  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          ERP Runicsoft
        </h2>
        <p className="text-slate-500">
          Panel general del sistema
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <Search size={16} className="text-slate-400" />
          <input
            className="outline-none text-sm bg-transparent"
            placeholder="Buscar..."
          />
        </div>

        <button className="relative rounded-2xl bg-white p-3 shadow-sm border border-slate-200">
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
            3
          </span>
        </button>
      </div>
    </header>
  )
}