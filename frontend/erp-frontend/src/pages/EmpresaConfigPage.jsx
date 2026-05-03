import { useEffect, useState } from "react"
import { Building2, Save } from "lucide-react"
import Sidebar from "../components/layout/Sidebar"
import Topbar from "../components/layout/Topbar"
import { getMiEmpresa, updateMiEmpresa } from "../services/empresaService"
import { useAuth } from "../context/AuthContext"

export default function EmpresaConfigPage() {
  const { refreshUser } = useAuth()

  const [form, setForm] = useState({
    razonSocial: "",
    nombreComercial: "",
    ruc: "",
    correo: "",
    telefono: "",
    direccion: "",
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    cargarEmpresa()
  }, [])

  const cargarEmpresa = async () => {
    setLoading(true)
    setError("")

    try {
      const data = await getMiEmpresa()

      setForm({
        razonSocial: data.razonSocial || "",
        nombreComercial: data.nombreComercial || "",
        ruc: data.ruc || "",
        correo: data.correo || "",
        telefono: data.telefono || "",
        direccion: data.direccion || "",
      })
    } catch (err) {
      setError(err.response?.data?.mensaje || "No se pudo cargar la empresa.")
    } finally {
      setLoading(false)
    }
  }

  const update = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage("")
    setError("")

    try {
      const payload = {
        razonSocial: form.razonSocial.trim(),
        nombreComercial: form.nombreComercial.trim(),
        ruc: form.ruc.trim() || null,
        correo: form.correo.trim() || null,
        telefono: form.telefono.trim() || null,
        direccion: form.direccion.trim() || null,
      }

      await updateMiEmpresa(payload)
      await refreshUser()

      setMessage("Empresa actualizada correctamente.")
    } catch (err) {
      setError(err.response?.data?.mensaje || "No se pudo actualizar la empresa.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Topbar />

          <section className="mt-8">
            <div className="max-w-4xl">
              {/* HEADER */}
              <div className="mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-cyan-100 text-cyan-700 grid place-items-center">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                      Configuración de empresa
                    </h1>
                    <p className="text-slate-500">
                      Edita los datos principales de tu empresa.
                    </p>
                  </div>
                </div>
              </div>

              {/* CARD */}
              <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-6">
                {loading ? (
                  <p className="text-slate-500">Cargando datos de empresa...</p>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">

                    {message && (
                      <div className="rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 text-sm">
                        {message}
                      </div>
                    )}

                    {error && (
                      <div className="rounded-2xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
                        {error}
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-5">
                      <label className="block">
                        <span className="text-sm font-medium text-slate-700">
                          Razón social
                        </span>
                        <input
                          name="razonSocial"
                          value={form.razonSocial}
                          onChange={update}
                          required
                          maxLength={250}
                          className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-400"
                        />
                      </label>

                      <label className="block">
                        <span className="text-sm font-medium text-slate-700">
                          Nombre comercial
                        </span>
                        <input
                          name="nombreComercial"
                          value={form.nombreComercial}
                          onChange={update}
                          required
                          maxLength={250}
                          className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-400"
                        />
                      </label>

                      <label className="block">
                        <span className="text-sm font-medium text-slate-700">
                          RUC
                        </span>
                        <input
                          name="ruc"
                          value={form.ruc}
                          onChange={update}
                          maxLength={20}
                          className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-400"
                        />
                      </label>

                      <label className="block">
                        <span className="text-sm font-medium text-slate-700">
                          Correo
                        </span>
                        <input
                          name="correo"
                          type="email"
                          value={form.correo}
                          onChange={update}
                          maxLength={250}
                          className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-400"
                        />
                      </label>

                      <label className="block">
                        <span className="text-sm font-medium text-slate-700">
                          Teléfono
                        </span>
                        <input
                          name="telefono"
                          value={form.telefono}
                          onChange={update}
                          maxLength={20}
                          className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-400"
                        />
                      </label>

                      <label className="block md:col-span-2">
                        <span className="text-sm font-medium text-slate-700">
                          Dirección
                        </span>
                        <input
                          name="direccion"
                          value={form.direccion}
                          onChange={update}
                          maxLength={250}
                          className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-400"
                        />
                      </label>
                    </div>

                    <div className="flex justify-end">
                      <button
                        disabled={saving}
                        className="inline-flex items-center gap-2 rounded-2xl bg-cyan-600 px-5 py-3 text-white font-semibold hover:bg-cyan-700 disabled:opacity-60"
                      >
                        <Save size={18} />
                        {saving ? "Guardando..." : "Guardar cambios"}
                      </button>
                    </div>

                  </form>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}