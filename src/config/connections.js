import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false // Desactiva logs para producción
  }
);

// Función mejorada para inicialización
export async function initializeDB() {
  try {
    await sequelize.authenticate();
    //console.log('✔️ Conexión a DB establecida');
    
    // Importa modelos dinámicamente (opcional)
    
    const pagosModel = await import('../models/pagos.js');
    const SubastaModel = await import('../models/subasta.js');
    const PaymentSessionModel = await import('../models/paymentSession.js');


    const pago = pagosModel.default(sequelize, Sequelize.DataTypes);
    const subasta = SubastaModel.default(sequelize, Sequelize.DataTypes);
    const PaymentSession = PaymentSessionModel.default(sequelize, Sequelize.DataTypes);

// ✅ Registrar manualmente en sequelize.models
    sequelize.models.pago = pago;
    sequelize.models.subasta = subasta;
    sequelize.models.PaymentSession = PaymentSession;

    // Retornar sequelize completo (con modelos registrados)
    return sequelize;
      } catch (error) {
        console.error('❌ Error inicializando DB:', error);
        throw error;
      }
  }