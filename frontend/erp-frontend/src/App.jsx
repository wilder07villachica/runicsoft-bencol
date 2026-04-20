import { Routes, Route, Navigate } from "react-router-dom"
import DashboardPage from "./pages/DashboardPage"
import ClientesPage from "./pages/ClientesPage"
import ProductosPage from "./pages/ProductosPage"
import ClientePreciosPage from "./pages/ClientePreciosPage"
import VentasPage from "./pages/VentasPage"
import NuevaVentaPage from "./pages/NuevaVentaPage"
import CajaPage from "./pages/CajaPage"


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/clientes" element={<ClientesPage />} />
      <Route path="/clientes/:id/precios" element={<ClientePreciosPage />} />
      <Route path="/productos" element={<ProductosPage />} />
      <Route path="/ventas" element={<VentasPage />} />
      <Route path="/ventas/nueva" element={<NuevaVentaPage />} />
      <Route path="/caja" element={<CajaPage />} />
    </Routes>
  )
}