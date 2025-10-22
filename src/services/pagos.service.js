import { getSessionStatus } from './placetopay.service.js';

export default class PagoService {
  constructor(sequelize) {
    this.models = sequelize.models;

    if (!this.models.pago) {
      throw new Error('El modelo Pago no está registrado en Sequelize');
    }
    if (!this.models.subasta) {
      throw new Error('El modelo Subasta no está registrado en Sequelize');
    }
    if (!this.models.PaymentSession) {
      throw new Error('El modelo PaymentSession no está registrado en Sequelize');
    }
  }

  // 🔹 Obtener todos los pagos pendientes
  async pagosPendientes() {
    try {
        //console.log('hola');
      const pagos = await this.models.PaymentSession.findAll({
        where: { status: 'PENDING' },
        //attributes: ['id_pago', 'sesionPago', 'estado_pago', 'reference'],
      });
      
      

      return pagos;
    } catch (error) {
      throw new Error(`Error al obtener pagos pendientes:`);
    }
  }

  // 🔹 Actualizar el estado de una sesión
  async actualizarEstadoSesion(sessionId) {
  try {
    //console.log(`Actualizando estado de la sesión: ${sessionId}`);
    // 1️⃣ Buscar la PaymentSession en BD
    const session = await this.models.PaymentSession.findOne({
      where: { requestId: sessionId },
    });
    if (!session) throw new Error('Sesión de pago no encontrada');

    // 2️⃣ Consultar el estado en PlacetoPay
    const result = await getSessionStatus(sessionId); // tu función en placetopay.js

    // 3️⃣ Actualizar la sesión en BD
    session.status = result.status.status;
    await session.save();

    // 4️⃣ Si el pago fue aprobado, actualizar el Pago
    //
    if (result.status.status === 'APPROVED'  ) {
      const pago = await this.models.pago.findOne({
        where: { id_pago: session.reference },
      });
      if (pago) {
        pago.estado_pago = 'aprobado';
        await pago.save();
      }

      const idSubasta=await this.models.pago.findOne({
        where: { id_pago: session.reference },
        attributes: ['id_subasta']
      });
      await this.models.subasta.update(
        { estado: 'Pagada' }, 
        { where: { id: idSubasta.id_subasta } }
      );
    }
    else if (result.status.status === 'PENDING' ) {
      
      const pago = await this.models.pago.findOne({
        where: { id_pago: session.reference },
      });   
      if (pago) {
        
        pago.estado_pago = 'pendiente';
        await pago.save();
        console.log(`Estado de la sesión en PlacetoPay: ${session.reference}`);
      } 
    }
    else {
      const pago = await this.models.pago.findOne({
        where: { id_pago: session.reference },
      });   
      if (pago) { 
        pago.estado_pago = 'fallido';
        await pago.save();
      } 
    }

    return {
      sessionId: session.requestId,
      status: session.status,
      processUrl: session.processUrl,
    };
  } catch (error) {
    throw new Error(`Error al actualizar estado de la sesión: ${error.message}`);
  }
}

}
