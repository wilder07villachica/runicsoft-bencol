import api from "./api"

export const authService = {
  login: (data) => api.post("/auth/login", data),

  register: (data) =>
    api.post("/auth/register", {
      nombre: data.nombre.trim(),
      correo: data.correo.trim().toLowerCase(),
      celular: data.celular.trim(),
      password: data.password,
    }),

  verifyEmail: (token) =>
    api.get(`/auth/verify-email?token=${encodeURIComponent(token)}`),

  forgotPassword: (correo) =>
    api.post("/auth/forgot-password", {
      correo: correo.trim().toLowerCase(),
    }),

  resetPassword: (data) =>
    api.post("/auth/reset-password", {
      token: data.token,
      nuevaPassword: data.nuevaPassword,
    }),

  me: () => api.get("/auth/me"),

  checkCorreo: (correo) =>
    api.get(`/auth/check-correo?correo=${encodeURIComponent(correo.trim().toLowerCase())}`),

  checkCelular: (celular) =>
    api.get(`/auth/check-celular?celular=${encodeURIComponent(celular.trim())}`),
}