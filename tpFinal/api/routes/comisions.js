var express = require("express");
var router = express.Router();
var models = require("../models");

router.get("/", (req, res,next) => {

  models.comision.findAll({
    attributes: ["id", "nombre_comision", "id_materia", "id_periodo", "anio_academico", "estado"],
    include: [
      {
        model: models.materia,
        as: 'Comision-Materia',
        attributes: ["id", "nombre"]
      },
      {
        model: models.periodo_lectivo,
        as: 'Comision-Periodo_lectivo',
        attributes: ["id", "nombre"]
      }
    ]
    }).then(comisions => res.send(comisions)).catch(error => { return next(error)});
});

router.post("/", (req, res) => {
  models.comision
    .create({ id: req.body.id,nombre_comision: req.body.nombre_comision,id_materia: req.body.id_materia,id_periodo: req.body.id_periodo, anio_academico: req.body.anio_academico,estado: req.body.estado })
    .then(comision => res.status(201).send({ id: comision.id }))
    .catch(error => {
      if (error == "SequelizeUniqueConstraintError: Validation error") {
        res.status(400).send('Bad request: existe otra comision con el mismo nombre')
      }
      else {
        console.log(`Error al intentar insertar en la base de datos: ${error}`)
        res.sendStatus(500)
      }
    });
});

const findComision = (id, { onSuccess, onNotFound, onError }) => {
  models.comision
    .findOne({
      attributes: ["id", "nombre_comision", "id_materia", "id_periodo", "anio_academico", "estado"],
      where: { id }
    })
    .then(comision => (comision ? onSuccess(comision) : onNotFound()))
    .catch(() => onError());
};

router.get("/:id", (req, res) => {
  findComision(req.params.id, {
    onSuccess: comision => res.send(comision),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.put("/:id", (req, res) => {
  const onSuccess = comision =>
    comision
      .update({ id: req.body.id,nombre_comision: req.body.nombre_comision,id_materia: req.body.id_materia,id_periodo: req.body.id_periodo, anio_academico: req.body.anio_academico,estado: req.body.estado }, { fields: ["id", "nombre_comision", "id_materia", "id_periodo", "anio_academico", "estado"] })
      .then(() => res.sendStatus(200))
      .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Bad request: existe otra comision con el mismo nombre')
        }
        else {
          console.log(`Error al intentar actualizar la base de datos: ${error}`)
          res.sendStatus(500)
        }
      });
    findComision(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.delete("/:id", (req, res) => {
  const onSuccess = comision =>
    comision
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findComision(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

module.exports = router;
