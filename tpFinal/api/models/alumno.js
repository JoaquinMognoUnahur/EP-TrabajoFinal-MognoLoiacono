'use strict';
module.exports = (sequelize, DataTypes) => {
  const alumno = sequelize.define('alumno', {
    nombre: DataTypes.STRING,
    apellido: DataTypes.STRING,
    dni: DataTypes.STRING,
    sexo: DataTypes.STRING,
    fecha_nacimiento: DataTypes.DATE,
    nacionalidad: DataTypes.STRING,
    email: DataTypes.STRING,
    id_carrera: DataTypes.INTEGER
  }, {});
  alumno.associate = function(models) {
      	//asociacion a carrera (pertenece a:)
        alumno.belongsTo(models.carrera // modelo al que pertenece
        ,{
          as : 'Carrera-Alumno',  // nombre de mi relacion
          foreignKey: 'id_carrera'     // campo con el que voy a igualar
        })
        /////////////////////
      };
  return alumno;
};