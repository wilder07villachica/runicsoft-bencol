import { Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import PublicRoute from "./components/auth/PublicRoute"

import AuthPage from "./pages/AuthPage"
import VerifyEmailPage from "./pages/VerifyEmailPage"
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import ResetPasswordPage from "./pages/ResetPasswordPage"

import DashboardPage from "./pages/DashboardPage"
import ClientesPage from "./pages/ClientesPage"
import ProductosPage from "./pages/ProductosPage"
import ClientePreciosPage from "./pages/ClientePreciosPage"
import VentasPage from "./pages/VentasPage"
import NuevaVentaPage from "./pages/NuevaVentaPage"
import CajaPage from "./pages/CajaPage"
import CuentasPorCobrarPage from "./pages/CuentasPorCobrarPage"

function Private({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<PublicRoute><AuthPage /></PublicRoute>} />
        <Route path="/verificar-correo" element={<VerifyEmailPage />} />
        <Route path="/recuperar-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
        <Route path="/restablecer-password" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Private><DashboardPage /></Private>} />
        <Route path="/clientes" element={<Private><ClientesPage /></Private>} />
        <Route path="/productos" element={<Private><ProductosPage /></Private>} />
        <Route path="/clientes/:id/precios" element={<Private><ClientePreciosPage /></Private>} />        
        <Route path="/ventas" element={<Private><VentasPage /></Private>} />
        <Route path="/ventas/nueva" element={<Private><NuevaVentaPage /></Private>} />
        <Route path="/caja" element={<Private><CajaPage /></Private>} />
        <Route path="/cuentas-por-cobrar" element={<Private><CuentasPorCobrarPage /></Private>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  )
}
