import api from "./api"

const BASE_URL = "/cuentas-por-cobrar"

export const listarCuentasPorCobrar = async (filtros = {}) => {
  const params = {}

  if (filtros.clienteId) params.clienteId = filtros.clienteId
  if (filtros.estado) params.estado = filtros.estado

  const response = await api.get(BASE_URL, { params })
  return response.data
}

export const buscarCuentaPorCobrar = async (cuentaId) => {
  const response = await api.get(`${BASE_URL}/${cuentaId}`)
  return response.data
}

export const actualizarCuentaPorCobrar = async (cuentaId, data) => {
  const response = await api.put(`${BASE_URL}/${cuentaId}`, data)
  return response.data
}

export const registrarAbonoCuentaPorCobrar = async (cuentaId, data) => {
  const response = await api.post(`${BASE_URL}/${cuentaId}/abonos`, data)
  return response.data
}