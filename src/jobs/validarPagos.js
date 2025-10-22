import cron from 'node-cron';
import PagoService from '../services/pagos.service.js';
import { initializeDB } from '../config/connections.js';
import { exit } from 'process';

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
  //console.log(pagos);
  

  if (!Array.isArray(pagos) || pagos.length === 0) {
    console.log('No hay pagos pendientes.');
    return;
  }

  for (const pago of pagos) {
    try {
        
        
      const resultado = await service.actualizarEstadoSesion(pago.requestId);
      
      //console.log(`Pago actualizado:`, resultado);
    } catch (error) {
      console.error('Error revisando pago:', error.message);
    }
  }
}

// Cron job cada 5 minutos
cron.schedule('*/1 * * * *', async () => {
  console.log('🔄 Revisando pagos pendientes...');
  await revisarPagos();
});
