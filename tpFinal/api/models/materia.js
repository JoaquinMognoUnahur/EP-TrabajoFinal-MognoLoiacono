'use strict';
module.exports = (sequelize, DataTypes) => {
  const materia = sequelize.define('materia', {
    nombre: DataTypes.STRING,
    id_carrera: DataTypes.INTEGER
  }, {});
  materia.associate = function(models) {

      	//asociacion a carrera (pertenece a:)
  	materia.belongsTo(models.carrera// modelo al que pertenece //este caso es belongsTo perto de uno a muchos por ej. en nuestra universidad, nuevos entornos pertenece a muchas carreras
    ,{
      as : 'Carrera-Materia',  // nombre de mi relacion 
      foreignKey: 'id_carrera'     // campo con el que voy a igualar
    })
  	/////////////////////
  };
  return materia;
};