import api from "./api"

export const getMiEmpresa = async () => {
  const response = await api.get("/empresa/me")
  return response.data
}

export const updateMiEmpresa = async (payload) => {
  const response = await api.put("/empresa/me", payload)
  return response.data
}