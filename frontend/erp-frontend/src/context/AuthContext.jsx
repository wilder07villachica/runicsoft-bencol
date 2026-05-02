import { createContext, useContext, useEffect, useState } from "react"
import { authService } from "../services/authService"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("bencol_user")
    return saved ? JSON.parse(saved) : null
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

    localStorage.setItem("bencol_token", data.token)
    localStorage.setItem("bencol_user", JSON.stringify(data.usuario))

    setUser(data.usuario)

    return data
  }

  const logout = () => {
    localStorage.removeItem("bencol_token")
    localStorage.removeItem("bencol_user")
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}