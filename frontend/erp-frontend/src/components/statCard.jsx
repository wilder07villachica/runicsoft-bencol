import { Boxes, Receipt, ShoppingCart, Users } from "lucide-react"

const icons = {
  users: Users,
  boxes: Boxes,
  shopping: ShoppingCart,
  receipt: Receipt,
}

export default function StatCard({ title, value, change, icon, gradient }) {
  const Icon = icons[icon]

  return (
    <div className={`rounded-3xl bg-gradient-to-r ${gradient} p-[1px] shadow-lg`}>
      <div className="rounded-3xl bg-white/10 backdrop-blur-md px-5 py-5 text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-white/80">{title}</p>
            <h3 className="mt-2 text-3xl font-bold">{value}</h3>
            <p className="mt-2 text-sm text-white/80">{change}</p>
          </div>

          <div className="rounded-2xl bg-white/20 p-3">
            <Icon size={22} />
          </div>
        </div>
      </div>
    </div>
  )
}