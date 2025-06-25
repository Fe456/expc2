import { DataTypes} from "sequelize";
import sequelize from "./declaracaoBD.js";

const Usuario = sequelize.define('Usuario', {
    ID_usuario: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    Nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ADM: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    CPF:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    DataNasc: {
        type: DataTypes.DATE,
        allowNull: false
    },
    Senha: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    Foto: {
        type: DataTypes.BLOB('medium'),
        allowNull: true
    },
    TipoFoto: {
        type: DataTypes.STRING,
        allowNull: true
    }}, {
        tablenName: 'Usuario',
        timestamps: false,
    }
);

const Estabelecimento = sequelize.define('Estabelecimento', {
    ID_estabelecimento: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    Nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Cnpj: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    Logradouro: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Numero: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Complemento: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Bairro: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Cidade: {
        type: DataTypes.STRING,
        allowNull: false
    },
    UF: {
        type: DataTypes.STRING,
        allowNull: false
    },
    CEP: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Telefone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    ID_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario,
            key: 'ID_usuario'
        },
        onDelete: 'CASCADE'
    }}, {
        tablenName: 'Estabelecimento',
        timestamps: false,
});

const FotosEstabelecimento = sequelize.define('FotosEstabelecimento', {
    ID_foto: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    Foto: {
        type: DataTypes.BLOB('medium'),
        allowNull: true
    },
    TipoFoto: {
        type: DataTypes.STRING,
        allowNull: true
    },
    ID_estabelecimento: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Estabelecimento,
            key: 'ID_estabelecimento'
        },
        onDelete: 'CASCADE'
    }}, {
        tablenName: 'FotosEstabelecimento',
        timestamps: false
});

const Servico = sequelize.define('Servico', {
    ID_servico: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    Nome: {
        type: DataTypes.STRING,
        allowNull: false
    }}, {
        tablenName: 'Servico',
        timestamps: false,
});


const Oferta = sequelize.define('Oferta', {
    ID_oferta: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    Valor: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    Grandeza: {
        type: DataTypes.STRING,
        allowNull: true
    },
    ID_servico: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Servico,
            key: 'ID_servico'
        },
        onDelete: 'CASCADE'
    },
    ID_estabelecimento: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Estabelecimento,
            key: 'ID_estabelecimento'
        },
        onDelete: 'CASCADE'
    },
    Descricao: {
        type: DataTypes.TEXT,
        allowNull: false
    }}, {
        tablenName: 'Oferta',
        timestamps: false,
});

const Avaliacao = sequelize.define('Avaliacao', {
    ID_avaliacao: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    Nota: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    Comentario: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    Data: {
        type: DataTypes.DATE,
        allowNull: false
    },
    ID_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario,
            key: 'ID_usuario'
        },
        onDelete: 'CASCADE'
    },
    ID_estabelecimento: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Estabelecimento,
          key: 'ID_estabelecimento'
        },
        onDelete: 'CASCADE'
      }}, {
        tableName: 'Avaliacao',
        timestamps: false,
});
const Favoritos = sequelize.define('Favoritos', {
    ID_favorito: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    ID_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario,
            key: 'ID_usuario'
        },
        onDelete: 'CASCADE'
    },
    ID_estabelecimento: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Estabelecimento,
            key: 'ID_estabelecimento'
        },
        onDelete: 'CASCADE'
    }},{
    tablenName: 'Favoritos',
    timestamps: false,
});
const Historico = sequelize.define('Historico', {
    ID_historico: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    DataAcesso: {
        type: DataTypes.DATE,
        allowNull: false
    },
    ID_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Usuario,
            key: 'ID_usuario'
        },
        onDelete: 'CASCADE'
    },
    ID_estabelecimento: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Estabelecimento,
            key: 'ID_estabelecimento'
        },
        onDelete: 'CASCADE'
    }},{
    tablenName: 'Historico',
    timestamps: false,
})

Estabelecimento.belongsTo(Usuario, { foreignKey: 'ID_usuario', onDelete: 'CASCADE' });
Oferta.belongsTo(Estabelecimento, { foreignKey: 'ID_estabelecimento', onDelete: 'CASCADE' });
Oferta.belongsTo(Servico, { foreignKey: 'ID_servico', onDelete: 'CASCADE' });
Avaliacao.belongsTo(Usuario, { foreignKey: 'ID_usuario', onDelete: 'CASCADE' });
FotosEstabelecimento.belongsTo(Estabelecimento, { foreignKey: 'ID_estabelecimento', onDelete: 'CASCADE' });
Favoritos.belongsTo(Usuario, { foreignKey: 'ID_usuario', onDelete: 'CASCADE' });
Favoritos.belongsTo(Estabelecimento, { foreignKey: 'ID_estabelecimento', onDelete: 'CASCADE' });
Historico.belongsTo(Usuario, { foreignKey: 'ID_usuario', onDelete: 'CASCADE' });
Historico.belongsTo(Estabelecimento, { foreignKey: 'ID_estabelecimento', onDelete: 'CASCADE' });

Usuario.hasMany(Favoritos, {
    foreignKey: 'ID_usuario',
    as: 'Favoritos',
    onDelete: 'CASCADE'
});

Usuario.hasMany(Historico, {
    foreignKey: 'ID_usuario',
    as: 'Historico',
    onDelete: 'CASCADE'
});
Estabelecimento.hasMany(FotosEstabelecimento, {
  foreignKey: 'ID_estabelecimento',
  as: 'fotos',
  onDelete: 'CASCADE'
});

// Um estabelecimento pode ter várias ofertas
Estabelecimento.hasMany(Oferta, {
  foreignKey: 'ID_estabelecimento',
  as: 'Ofertas',
  onDelete: 'CASCADE'
});

// Um estabelecimento pode ter muitos favoritos
Estabelecimento.hasMany(Favoritos, {
  foreignKey: 'ID_estabelecimento',
  as: 'Favoritos',
  onDelete: 'CASCADE'
});

// Um estabelecimento pode ter vários acessos no histórico
Estabelecimento.hasMany(Historico, {
  foreignKey: 'ID_estabelecimento',
  as: 'Historico',
  onDelete: 'CASCADE'
});

Oferta.hasMany(Avaliacao, {
  foreignKey: 'ID_usuario',
  as: 'Avaliacao',
  onDelete: 'CASCADE'
});

// E você também precisa das inversas para FotosEstabelecimento, Oferta, etc:

// Usuario.hasMany(Estabelecimento, { foreignKey: 'ID_estabelecimento', as: 'estabelecimento', onDelete: 'CASCADE'});
// Usuario.hasMany(Avaliacao, { foreignKey: 'ID_avaliacao', as:'avaliacao', onDelete: 'CASCADE'});
// Estabelecimento.hasMany(Oferta, { foreignKey: 'ID_oferta', as: 'oferta', onDelete: 'CASCADE'});
// Oferta.hasMany(Avaliacao, { foreignKey: 'ID_avaliacao', as: 'avaliacao', onDelete: 'CASCADE'});
// Servico.hasMany(Oferta, { foreignKey: 'ID_oferta', as: 'oferta', onDelete: 'CASCADE'});

export {Usuario, Estabelecimento, Servico, Oferta, Avaliacao, FotosEstabelecimento};