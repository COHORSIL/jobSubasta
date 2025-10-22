import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const PaymentSession = sequelize.define('payment_sessions', {
   
    

    requestId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Identificador de la sesión devuelto por PlaceToPay'
    },

    processUrl: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      comment: 'URL generada por PlaceToPay para redirigir al usuario'
    },

    reference: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'La referencia es requerida' },
        len: {
          args: [1, 100],
          msg: 'La referencia debe tener entre 3 y 100 caracteres'
        }
      },
      comment: 'Referencia única usada en PlaceToPay'
    },

    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'PENDING',
      validate: {
        isIn: {
          args: [['PENDING', 'APPROVED', 'REJECTED', 'FAILED', 'EXPIRED']],
          msg: 'Estado de sesión inválido'
        }
      },
      comment: 'Estado actual de la sesión según PlaceToPay'
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Monto de la transacción'
    },

    

    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },

    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    ip_origen: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    agente:{
      type: DataTypes.STRING(255),
      allowNull:true
    }

  }, {
    sequelize,
    tableName: 'payment_sessions',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        fields: ['id_sesion']
      },
      {
        name: 'idx_payment_reference',
        unique: true,
        fields: ['reference']
      }
    ]
  });

  // 🔗 Asociación con tu tabla de pagos
  /*PaymentSession.associate = (models) => {
    PaymentSession.belongsTo(models.pago, {
      foreignKey: 'id_pago',
      as: 'pago'
    });
  };*/

  return PaymentSession;
};
