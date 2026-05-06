export default function SidePanel({ title, items }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}