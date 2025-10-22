import cron from 'node-cron';
import PagoService from '../services/pagos.service.js';
import { initializeDB } from '../config/connections.js';

let pagoServiceInstance = null;

const initService = async () => {
  if (!pagoServiceInstance) {
    const sequelize = await initializeDB();
    pagoServiceInstance = new PagoService(sequelize);
  }
  return pagoServiceInstance;
};

export async function revisarPagos() {
  const service = await initService();
  const pagos = await service.pagosPendientes();

  for (const pago of pagos) {
    try {
      const resultado = await service.actualizarEstadoSesion(pago.sesionPago);
      //console.log(`Pago actualizado:`, resultado);
    } catch (error) {
      console.error('Error revisando pago:', error.message);
    }
  }
}

// Cron job cada 5 minutos
cron.schedule('*/5 * * * *', async () => {
  console.log('🔄 Revisando pagos pendientes...');
  await revisarPagos();
});
