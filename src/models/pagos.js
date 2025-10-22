import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Pago = sequelize.define('pago', {
    id_pago: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      validate: {
        isInt: {
          msg: 'El ID del pago debe ser un número entero'
        }
      }
    },

    id_usuario: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    id_subasta: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'El ID de subasta es requerido' },
        isInt: { msg: 'Debe ser un número entero' }
      }
    },

    monto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        notNull: { msg: 'El monto es requerido' },
        isDecimal: { msg: 'El monto debe ser decimal' },
        min: {
          args: [0.01],
          msg: 'El monto debe ser mayor que 0'
        }
      }
    },

    metodo_pago: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El método de pago es requerido' },
        len: {
          args: [3, 50],
          msg: 'Debe tener entre 3 y 50 caracteres'
        }
      }
    },

    fecha_pago: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      validate: {
        isDate: {
          msg: 'La fecha de pago debe ser válida'
        }
      }
    },

    estado_pago: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'pendiente',
        validate: {
          isIn: {
            args: [['pendiente', 'aprobado', 'fallido', 'reembolsado']],
            msg: 'Estado de pago inválido'
          }
        }
      },

      referencia_externa: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'ID de la transacción en la pasarela (ej. Stripe, BAC)'
      },

      comprobante_url: {
        type: DataTypes.STRING(1000),
        allowNull: true
      },

      moneda: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: 'HNL'
      },

      ip_origen: {
        type: DataTypes.STRING(45),
        allowNull: true
      },
      descripcion: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: {
          len: {
            args: [0, 255],
            msg: 'La descripción no puede exceder 255 caracteres'
          }
        }
      },
      nombre: {
        type: DataTypes.STRING(100),
        allowNull: true,
        validate: {
          len: {
            args: [0, 100],
            msg: 'El nombre no puede exceder 100 caracteres'
          }
        }
      },
      telefono: {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
          len: {
            args: [0, 20],
            msg: 'El teléfono no puede exceder 20 caracteres'
          }
        }
      },
      direccion: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: {
          len: {
            args: [0, 255],
            msg: 'La dirección no puede exceder 255 caracteres'
          }
        }
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: true,
        validate: {
          isEmail: {
            msg: 'Debe ser un correo electrónico válido'
          },
          len: {
            args: [0, 100],
            msg: 'El correo electrónico no puede exceder 100 caracteres'
          }
        }
      },
      sesionPago: {
        type: DataTypes.INTEGER,
        allowNull: true,         
      }
  }, {
    sequelize,
    tableName: 'pago',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        fields: ['id_pago']
      },
      {
        name: 'idx_usuario_subasta',
        unique: true,
        fields: ['id_usuario', 'id_subasta']
      }
    ]
  });

  // Asociaciones (configúralas luego en el archivo de relaciones)
  

  return Pago;
};
