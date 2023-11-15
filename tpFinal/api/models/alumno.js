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
      	//asociacion a carrera (pertenece a:) // belongsTo significa que existe una relación uno a uno entre A y B, con la clave externa definida en el modelo fuente (A).
        alumno.belongsTo(models.carrera // modelo al que pertenece //cardinalidad 1 a 1, por eso se utiliza belongsTo
        ,{
          as : 'Carrera-Alumno',  // nombre de mi relacion que se utilizará en routes
          foreignKey: 'id_carrera'     // campo con el que voy a igualar
        })
        /////////////////////
      };
  return alumno;
};