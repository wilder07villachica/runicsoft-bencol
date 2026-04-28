import axios from "axios"

const api = axios.create({
  baseURL: "https://runicsoft-bencol-production.up.railway.app",
})

export default api