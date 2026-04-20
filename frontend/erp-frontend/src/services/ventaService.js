import api from "./api"

export const getVentas = async () => {
  const response = await api.get("/ventas")
  return response.data
}

export const getVentaById = async (id) => {
  const response = await api.get(`/ventas/${id}`)
  return response.data
}

export const createVenta = async (payload) => {
  const response = await api.post("/ventas", payload)
  return response.data
}