import api from "./api"

export const getMovimientosCaja = async () => {
  const response = await api.get("/movimientos")
  return response.data
}

export const getMovimientoCajaById = async (id) => {
  const response = await api.get(`/movimientos/${id}`)
  return response.data
}

export const getMovimientosByCaja = async (cajaId) => {
  const response = await api.get(`/movimientos/caja/${cajaId}`)
  return response.data
}

export const registrarIngresoManual = async (payload) => {
  const response = await api.post("/movimientos/ingreso-manual", payload)
  return response.data
}

export const registrarEgresoManual = async (payload) => {
  const response = await api.post("/movimientos/egreso-manual", payload)
  return response.data
}