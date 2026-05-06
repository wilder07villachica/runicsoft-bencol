import { Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/authContext.jsx"
import ProtectedRoute from "./components/auth/protectedRoute.jsx"
import PublicRoute from "./components/auth/publicRoute.jsx"

import AuthPage from "./pages/authPage.jsx"
import VerifyEmailPage from "./pages/verifyEmailPage.jsx"
import ForgotPasswordPage from "./pages/forgotPasswordPage.jsx"
import ResetPasswordPage from "./pages/resetPasswordPage.jsx"

import DashboardPage from "./pages/dashboardPage.jsx"
import ClientesPage from "./pages/clientesPage.jsx"
import ProductosPage from "./pages/productosPage.jsx"
import ClientePreciosPage from "./pages/clientePreciosPage.jsx"
import VentasPage from "./pages/ventasPage.jsx"
import NuevaVentaPage from "./pages/nuevaVentaPage.jsx"
import CajaPage from "./pages/cajaPage.jsx"
import CuentasPorCobrarPage from "./pages/cuentasPorCobrarPage.jsx"
import EmpresaConfigPage from "./pages/empresaConfigPage.jsx"

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