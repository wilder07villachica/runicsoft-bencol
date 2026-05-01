import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Droplets, Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { authService } from "../services/authService"

export default function AuthPage() {
  const [mode, setMode] = useState("login")
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ nombre: "", correo: "", celular: "", password: "" })
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [correoDisponible, setCorreoDisponible] = useState(null)
  const [celularDisponible, setCelularDisponible] = useState(null)
  const { login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (mode !== "register" || !form.correo.includes("@")) {
      setCorreoDisponible(null)
      return
    }
    const timer = setTimeout(async () => {
      try {
        const { data } = await authService.checkCorreo(form.correo)
        setCorreoDisponible(data.disponible)
      } catch {
        setCorreoDisponible(null)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [form.correo, mode])

  useEffect(() => {
    if (mode !== "register" || form.celular.length < 9) {
      setCelularDisponible(null)
      return
    }
    const timer = setTimeout(async () => {
      try {
        const { data } = await authService.checkCelular(form.celular)
        setCelularDisponible(data.disponible)
      } catch {
        setCelularDisponible(null)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [form.celular, mode])

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setMessage("")
    setLoading(true)

    try {
      if (mode === "login") {
        await login({ correo: form.correo, password: form.password })
        navigate("/dashboard")
      } else {
        const { data } = await authService.register(form)
        setMessage(data.mensaje || "Usuario registrado. Verifica tu correo.")
        setMode("login")
        setForm({ nombre: "", correo: form.correo, celular: "", password: "" })
      }
    } catch (err) {
      setError(err.response?.data?.mensaje || "No se pudo completar la operación.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 grid lg:grid-cols-[1.1fr_.9fr]">
      <section className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-cyan-500/20 grid place-items-center border border-cyan-400/30">
            <Droplets className="text-cyan-300" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Runicsoft Bencol</h1>
            <p className="text-slate-400 text-sm">Gestión de ventas, caja y finanzas</p>
          </div>
        </div>

        <div className="max-w-xl">
          <p className="text-cyan-300 font-semibold mb-3">Panel administrativo seguro</p>
          <h2 className="text-5xl font-black leading-tight mb-5">Controla tu negocio con usuarios protegidos.</h2>
          <p className="text-slate-300 text-lg">Inicia sesión, crea usuarios verificados y protege tus módulos actuales sin romper ventas, clientes, productos, caja ni finanzas.</p>
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm text-slate-300">
          <div className="rounded-2xl bg-white/5 p-4 border border-white/10">JWT seguro</div>
          <div className="rounded-2xl bg-white/5 p-4 border border-white/10">Correo verificado</div>
          <div className="rounded-2xl bg-white/5 p-4 border border-white/10">Roles preparados</div>
        </div>
      </section>

      <section className="flex items-center justify-center p-5 sm:p-8">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl p-6 sm:p-8">
          <div className="mb-7">
            <h2 className="text-3xl font-bold">{mode === "login" ? "Iniciar sesión" : "Crear usuario"}</h2>
            <p className="text-slate-400 mt-2">{mode === "login" ? "Ingresa con tu correo y contraseña." : "Registra tus datos y verifica tu correo."}</p>
          </div>

          {message && <div className="mb-4 rounded-xl bg-emerald-500/10 border border-emerald-400/30 text-emerald-200 px-4 py-3 text-sm">{message}</div>}
          {error && <div className="mb-4 rounded-xl bg-red-500/10 border border-red-400/30 text-red-200 px-4 py-3 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <label className="block">
                <span className="text-sm text-slate-300">Nombre</span>
                <div className="mt-1 flex items-center gap-2 rounded-2xl bg-slate-900 border border-white/10 px-3">
                  <User size={18} className="text-slate-400" />
                  <input name="nombre" value={form.nombre} onChange={update} className="w-full bg-transparent outline-none py-3" required minLength={3} />
                </div>
              </label>
            )}

            <label className="block">
              <span className="text-sm text-slate-300">Correo</span>
              <div className="mt-1 flex items-center gap-2 rounded-2xl bg-slate-900 border border-white/10 px-3">
                <Mail size={18} className="text-slate-400" />
                <input name="correo" type="email" value={form.correo} onChange={update} className="w-full bg-transparent outline-none py-3" required />
              </div>
              {mode === "register" && correoDisponible !== null && (
                <small className={correoDisponible ? "text-emerald-300" : "text-red-300"}>{correoDisponible ? "Correo disponible" : "Correo ya registrado"}</small>
              )}
            </label>

            {mode === "register" && (
              <label className="block">
                <span className="text-sm text-slate-300">Celular</span>
                <div className="mt-1 flex items-center gap-2 rounded-2xl bg-slate-900 border border-white/10 px-3">
                  <Phone size={18} className="text-slate-400" />
                  <input name="celular" value={form.celular} onChange={update} className="w-full bg-transparent outline-none py-3" required minLength={9} />
                </div>
                {celularDisponible !== null && (
                  <small className={celularDisponible ? "text-emerald-300" : "text-red-300"}>{celularDisponible ? "Celular disponible" : "Celular ya registrado"}</small>
                )}
              </label>
            )}

            <label className="block">
              <span className="text-sm text-slate-300">Contraseña</span>
              <div className="mt-1 flex items-center gap-2 rounded-2xl bg-slate-900 border border-white/10 px-3">
                <Lock size={18} className="text-slate-400" />
                <input name="password" type={showPassword ? "text" : "password"} value={form.password} onChange={update} className="w-full bg-transparent outline-none py-3" required minLength={8} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-400 hover:text-white">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            {mode === "login" && <Link to="/recuperar-password" className="block text-sm text-cyan-300 hover:text-cyan-200">¿Olvidaste tu contraseña?</Link>}

            <button disabled={loading} className="w-full rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 transition disabled:opacity-60">
              {loading ? "Procesando..." : mode === "login" ? "Ingresar" : "Crear usuario"}
            </button>
          </form>

          <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); setMessage("") }} className="w-full mt-5 text-sm text-slate-300 hover:text-white">
            {mode === "login" ? "¿Nuevo usuario? Crear una cuenta" : "Ya tengo usuario. Iniciar sesión"}
          </button>
        </div>
      </section>
    </div>
  )
}
