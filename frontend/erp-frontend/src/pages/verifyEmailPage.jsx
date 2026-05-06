import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { authService } from "../services/authService"

export default function VerifyEmailPage() {
  const [params] = useSearchParams()
  const [status, setStatus] = useState("Verificando correo...")
  const [ok, setOk] = useState(false)

  useEffect(() => {
    const token = params.get("token")
    if (!token) {
      setStatus("Token no encontrado.")
      return
    }
    authService.verifyEmail(token)
      .then(({ data }) => { setOk(true); setStatus(data.mensaje) })
      .catch((err) => setStatus(err.response?.data?.mensaje || "No se pudo verificar el correo."))
  }, [params])

  return (
    <div className="min-h-screen bg-slate-950 text-white grid place-items-center p-5">
      <div className="max-w-md w-full rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center">
        <h1 className="text-3xl font-bold mb-3">Verificación de correo</h1>
        <p className={ok ? "text-emerald-300" : "text-slate-300"}>{status}</p>
        <Link to="/login" className="inline-block mt-6 rounded-2xl bg-cyan-500 text-slate-950 font-bold px-5 py-3">Ir al login</Link>
      </div>
    </div>
  )
}
