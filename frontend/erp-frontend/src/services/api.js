import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:8000",
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("bencol_token")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const isAuthPage =
      window.location.pathname === "/login" ||
      window.location.pathname === "/register" ||
      window.location.pathname === "/verificar-correo" ||
      window.location.pathname === "/olvide-password" ||
      window.location.pathname === "/restablecer-password"

    if ((status === 401 || status === 403) && !isAuthPage) {
      localStorage.removeItem("bencol_token")
      localStorage.removeItem("bencol_user")
      window.location.href = "/login"
    }

    return Promise.reject(error)
  }
)

export default api