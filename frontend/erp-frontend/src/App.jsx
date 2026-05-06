import { Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/authContext"
import ProtectedRoute from "./components/auth/protectedRoute"
import PublicRoute from "./components/auth/publicRoute"

import AuthPage from "./pages/authPage"
import VerifyEmailPage from "./pages/verifyEmailPage"
import ForgotPasswordPage from "./pages/forgotPasswordPage"
import ResetPasswordPage from "./pages/resetPasswordPage"

import DashboardPage from "./pages/dashboardPage"
import ClientesPage from "./pages/clientesPage"
import ProductosPage from "./pages/productosPage"
import ClientePreciosPage from "./pages/clientePreciosPage"
import VentasPage from "./pages/ventasPage"
import NuevaVentaPage from "./pages/nuevaVentaPage"
import CajaPage from "./pages/cajaPage"
import CuentasPorCobrarPage from "./pages/cuentasPorCobrarPage"
import EmpresaConfigPage from "./pages/empresaConfigPage"

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
        <Route path="/configuracion" element={<Private><EmpresaConfigPage /></Private>} />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  )
}