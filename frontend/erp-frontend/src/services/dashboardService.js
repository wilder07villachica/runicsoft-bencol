import { getClientes } from "./ClienteService"
import { getProductos } from "./ProductoService"
import { getVentas } from "./ventaService"
import { getCajas, getCajaPrincipal } from "./CajaService"
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