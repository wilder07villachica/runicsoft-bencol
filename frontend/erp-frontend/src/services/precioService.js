import api from "./api"

export const getPreciosByCliente = async (clienteId) => {
  const response = await api.get(`/precios/cliente/${clienteId}`)
  return response.data
}

export const createPrecio = async (payload) => {
  const response = await api.post("/precios", payload)
  return response.data
}

export const updatePrecio = async (id, payload) => {
  const response = await api.put(`/precios/${id}`, payload)
  return response.data
}

export const deletePrecio = async (id) => {
  await api.delete(`/precios/${id}`)
}