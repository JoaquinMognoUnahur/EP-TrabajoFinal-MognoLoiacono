'use strict';
module.exports = (sequelize, DataTypes) => {
  const comision = sequelize.define('comision', {
    nombre_comision: DataTypes.STRING,
    id_materia: DataTypes.INTEGER,
    id_periodo: DataTypes.INTEGER,
    anio_academico: DataTypes.NUMERIC,
    estado: DataTypes.STRING(1) // A o P
  }, {});

  comision.associate = function(models) {
    // Asociación a materia (pertenece a:)
    comision.belongsTo(models.materia, {
      as: 'Comision-Materia',  // nombre de la relación
      foreignKey: 'id_materia'  // campo con el que vas a igualar
    });

    // Asociación a periodo lectivo (pertenece a:)
    comision.belongsTo(models.periodo_lectivo, {
      as: 'Comision-Periodo_lectivo',  // nombre de la relación
      foreignKey: 'id_periodo'  // campo con el que vas a igualar
    });
  };

  return comision;
};
