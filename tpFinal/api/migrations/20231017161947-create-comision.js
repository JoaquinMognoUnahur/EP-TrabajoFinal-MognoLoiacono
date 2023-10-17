'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('comisions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre_comision: {
        type: Sequelize.STRING,
      },
      id_materia: {
        type: Sequelize.INTEGER,
      },
      id_periodo: {
        type: Sequelize.INTEGER,
        },
      anio_academico: {
        type: Sequelize.NUMERIC,
      },
      estado: {
        type: Sequelize.STRING(1),
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('comisions');
  },
};
