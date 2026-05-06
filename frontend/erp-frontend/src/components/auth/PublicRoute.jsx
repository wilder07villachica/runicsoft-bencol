import { Navigate } from "react-router-dom"
import { useAuth } from "../../context/authContext"

export default function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div className="min-h-screen bg-slate-950 text-white grid place-items-center">Cargando...</div>
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
