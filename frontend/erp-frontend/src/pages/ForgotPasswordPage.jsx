import { useState } from "react"
import { Link } from "react-router-dom"
import { authService } from "../services/authService"

export default function ForgotPasswordPage() {
  const [correo, setCorreo] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setMessage(""); setError(""); setLoading(true)
    try {
      const { data } = await authService.forgotPassword(correo)
      setMessage(data.mensaje)
    } catch (err) {
      setError(err.response?.data?.mensaje || "No se pudo procesar la solicitud.")
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white grid place-items-center p-5">
      <div className="max-w-md w-full rounded-3xl border border-white/10 bg-white/[0.04] p-8">
        <h1 className="text-3xl font-bold mb-2">Recuperar contraseña</h1>
        <p className="text-slate-400 mb-6">Ingresa tu correo y enviaremos instrucciones.</p>
        {message && <div className="mb-4 rounded-xl bg-emerald-500/10 border border-emerald-400/30 text-emerald-200 px-4 py-3 text-sm">{message}</div>}
        {error && <div className="mb-4 rounded-xl bg-red-500/10 border border-red-400/30 text-red-200 px-4 py-3 text-sm">{error}</div>}
        <form onSubmit={submit} className="space-y-4">
          <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="correo@empresa.com" required className="w-full rounded-2xl bg-slate-900 border border-white/10 px-4 py-3 outline-none" />
          <button disabled={loading} className="w-full rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 disabled:opacity-60">{loading ? "Enviando..." : "Enviar instrucciones"}</button>
        </form>
        <Link to="/login" className="block mt-5 text-center text-cyan-300">Volver al login</Link>
      </div>
    </div>
  )
}
