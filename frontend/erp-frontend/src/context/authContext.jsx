import { createContext, useContext, useEffect, useState } from "react"
import { authService } from "../services/authService.js"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("bencol_user")

    try {
      return saved ? JSON.parse(saved) : null
    } catch {
      localStorage.removeItem("bencol_user")
      return null
    }
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("bencol_token")

    if (!token) {
      localStorage.removeItem("bencol_user")
      setUser(null)
      setLoading(false)
      return
    }

    authService
      .me()
      .then(({ data }) => {
        localStorage.setItem("bencol_user", JSON.stringify(data))
        setUser(data)
      })
      .catch(() => {
        localStorage.removeItem("bencol_token")
        localStorage.removeItem("bencol_user")
        setUser(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const login = async (payload) => {
    const { data } = await authService.login({
      correo: payload.correo.trim().toLowerCase(),
      password: payload.password,
    })

    if (!data?.token || !data?.usuario) {
      throw new Error("Respuesta de login inválida.")
    }

    if (!data.usuario.empresaId) {
      throw new Error("El usuario no tiene empresa asociada.")
    }

    localStorage.setItem("bencol_token", data.token)
    localStorage.setItem("bencol_user", JSON.stringify(data.usuario))

    setUser(data.usuario)

    return data
  }

  const refreshUser = async () => {
    const { data } = await authService.me()

    localStorage.setItem("bencol_user", JSON.stringify(data))
    setUser(data)

    return data
  }

  const logout = () => {
    localStorage.removeItem("bencol_token")
    localStorage.removeItem("bencol_user")
    setUser(null)
    window.location.href = "/login"
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refreshUser,
        isAuthenticated: !!user,
        empresaId: user?.empresaId ?? null,
        empresaNombre: user?.empresaNombre ?? null,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}