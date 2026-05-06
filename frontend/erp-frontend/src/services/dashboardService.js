import { getClientes } from "./clienteService.js"
import { getProductos } from "./productoService.js"
import { getVentas } from "./ventaService.js"
import { getCajas, getCajaPrincipal } from "./cajaService.js"
import { getMovimientosCaja } from "./movimientoCajaService.js"

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