import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Subasta = sequelize.define('subasta', {
    id: {  // Asegúrate de usar el mismo nombre en claves e índices
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      validate: {
        isInt: {
          msg: 'El ID debe ser un número entero'
        }
      }
    },
    id_producto: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'producto',
        key: 'id_producto'
      },
      validate: {
        isInt: {
          msg: 'El ID del producto debe ser un número entero'
        },
        min: {
          args: [1],
          msg: 'El ID del producto debe ser mayor que cero'
        }
      }
    },
    precio_base: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        notNull: { msg: 'El precio base es obligatorio' },
        isDecimal: { msg: 'El precio base debe ser un número decimal' },
        min: {
          args: [0.01],
          msg: 'El precio base debe ser mayor a cero'
        }
      }
    },
    incremento_min: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        notNull: { msg: 'El incremento mínimo es obligatorio' },
        isDecimal: { msg: 'El incremento mínimo debe ser un número decimal' },
        min: {
          args: [0.01],
          msg: 'El incremento mínimo debe ser mayor a cero'
        }
      }
    },
    fecha_inicio: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: { msg: 'La fecha de inicio es obligatoria' },
        isDate: { msg: 'La fecha de inicio debe ser una fecha válida' }
      }
    },
    fecha_fin: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: { msg: 'La fecha de fin es obligatoria' },
        isDate: { msg: 'La fecha de fin debe ser una fecha válida' },
        isAfterFechaInicio(value) {
          if (this.fecha_inicio && value <= this.fecha_inicio) {
            throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
          }
        }
      }
    },
    estado: {
      type: DataTypes.ENUM('Abierta', 'Cerrada', 'Vendida', 'Pagada'),
      allowNull: true,
      defaultValue: 'Abierta',
      validate: {
        isIn: {
          args: [['Abierta', 'Cerrada', 'Vendida','Pagada']],
          msg: 'El estado debe ser: Abierta, Cerrada o Vendida'
        }
      }
    },
    precio_actual: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        isDecimal: {
          msg: 'El precio actual debe ser un número decimal'
        },
        min: {
          args: [0],
          msg: 'El precio actual no puede ser negativo'
        }
      }
    },
    ganador: {
      type:  DataTypes.STRING(255),
      allowNull: true,
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      validate: {
        isDate: {
          msg: 'La fecha de pago debe ser válida'
        }
      }
    },
  }, {
    sequelize,
    tableName: 'subasta',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [{ name: "id_subasta" }]
      },
      {
        name: "id_producto",
        using: "BTREE",
        fields: [{ name: "id_producto" }]
      }
    ]
  });

  return Subasta;
};
