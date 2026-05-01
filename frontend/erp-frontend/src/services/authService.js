import api from "./api"

export const authService = {
    login: (data) => api.post("/auth/login", data),
    register: (data) => api.post("/auth/register", data),
    verifyEmail: (token) => api.get(`/auth/verify-email?token=${encodeURIComponent(token)}`),
    forgotPassword: (correo) => api.post("/auth/forgot-password", { correo }),
    resetPassword: (data) => api.post("/auth/reset-password", data),
    me: () => api.get("/auth/me"),
    checkCorreo: (correo) => api.get(`/auth/check-correo?correo=${encodeURIComponent(correo)}`),
    checkCelular: (celular) => api.get(`/auth/check-celular?celular=${encodeURIComponent(celular)}`),
}
