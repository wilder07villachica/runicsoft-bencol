import api from "./api"

export const getCajas = async () => {
  const response = await api.get("/cajas")
  return response.data
}

export const getCajasActivas = async () => {
  const response = await api.get("/cajas/activas")
  return response.data
}

export const getCajaPrincipal = async () => {
  try {
    const response = await api.get("/cajas/principal")
    return response.data
  } catch (error) {
    if (error.response?.status === 400 || error.response?.status === 404) {
      return null
    }
    throw error
  }
}

export const getCajaById = async (id) => {
  const response = await api.get(`/cajas/${id}`)
  return response.data
}

export const createCaja = async (payload) => {
  const response = await api.post("/cajas", payload)
  return response.data
}

export const updateCaja = async (id, payload) => {
  const response = await api.put(`/cajas/${id}`, payload)
  return response.data
}

export const activarCaja = async (id) => {
  const response = await api.patch(`/cajas/${id}/activar`)
  return response.data
}

export const desactivarCaja = async (id) => {
  const response = await api.patch(`/cajas/${id}/desactivar`)
  return response.data
}

export const marcarCajaPrincipal = async (id) => {
  const response = await api.patch(`/cajas/${id}/principal`)
  return response.data
}