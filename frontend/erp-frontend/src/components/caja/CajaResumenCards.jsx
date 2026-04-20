function formatMoney(value) {
  return `S/ ${Number(value ?? 0).toFixed(2)}`
}

export default function CajaResumenCards({ cajas, principal }) {
  const activas = cajas.filter((caja) => caja.activa).length
  const saldoTotal = cajas.reduce(
    (acc, caja) => acc + Number(caja.saldoActual ?? 0),
    0
  )

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
        <p className="text-sm text-slate-500">Caja principal</p>
        <h3 className="mt-2 text-2xl font-bold text-slate-900">
          {principal?.nombre || "No definida"}
        </h3>
        <p className="mt-2 text-sm text-slate-500">
          {principal ? formatMoney(principal.saldoActual) : "Sin saldo disponible"}
        </p>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
        <p className="text-sm text-slate-500">Cajas activas</p>
        <h3 className="mt-2 text-2xl font-bold text-slate-900">{activas}</h3>
        <p className="mt-2 text-sm text-slate-500">Cajas disponibles para operar</p>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
        <p className="text-sm text-slate-500">Saldo total</p>
        <h3 className="mt-2 text-2xl font-bold text-slate-900">
          {formatMoney(saldoTotal)}
        </h3>
        <p className="mt-2 text-sm text-slate-500">Suma de todas las cajas</p>
      </div>
    </section>
  )
}