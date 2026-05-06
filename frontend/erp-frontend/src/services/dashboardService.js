import { getClientes } from "./clienteService"
import { getProductos } from "./productoService"
import { getVentas } from "./ventaService"
import { getCajas, getCajaPrincipal } from "./cajaService"
import { getMovimientosCaja } from "./movimientoCajaService"

export const getDashboardData = async () => {
  const [clientes, productos, ventas, cajas, movimientos, cajaPrincipal] =
    await Promise.all([
      getClientes(),
      getProductos(),
      getVentas(),
      getCajas(),
      getMovimientosCaja(),
      getCajaPrincipal().catch(() => null),
    ])

  return {
    clientes,
    productos,
    ventas,
    cajas,
    movimientos,
    cajaPrincipal,
  }
}