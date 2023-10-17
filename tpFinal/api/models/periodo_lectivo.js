'use strict';
module.exports = (sequelize, DataTypes) => {
  const periodo_lectivo = sequelize.define('periodo_lectivo', {
    nombre: DataTypes.STRING,
    anio_academico: DataTypes.NUMERIC,
    fecha_inicio: DataTypes.DATE,
    fecha_fin: DataTypes.DATE
  }, {});
  
  return periodo_lectivo;
};