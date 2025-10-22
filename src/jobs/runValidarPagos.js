import 'dotenv/config.js';
import { revisarPagos } from './validarPagos.js';

(async () => {
  try {
    await revisarPagos();
    console.log('✅ Job de validación de pagos ejecutado correctamente.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error al ejecutar el job:', err);
    process.exit(1);
  }
})();
