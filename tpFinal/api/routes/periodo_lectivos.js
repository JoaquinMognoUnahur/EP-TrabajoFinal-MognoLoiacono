var express = require("express");
var router = express.Router();
var models = require("../models");

router.get("/", (req, res) => {

  let pagina = parseInt(req.query.pagina);
  let cantPorPag = parseInt(req.query.cantPorPag);

  pagina = isNaN(pagina) || pagina <= 0 ? 1 : pagina;
  cantPorPag = isNaN(cantPorPag) || cantPorPag <= 0 ? 5 : cantPorPag;

  console.log("Esto es un mensaje para ver en consola");
  models.periodo_lectivo
    .findAndCountAll({
      attributes: ["nombre", "anio_academico", "fecha_inicio", "fecha_fin"],
    
      limit: cantPorPag,
      offset: (pagina - 1) * (cantPorPag),

    })
    .then(resp => {
      const totalElementos = resp.count;
      const periodo_lectivos = resp.rows;
      const totalPaginas = Math.ceil(totalElementos/cantPorPag);

      res.send({
        totalElementos,
        totalPaginas,
        paginaNro: pagina,
        periodo_lectivos
      })
    })
    .catch(() => res.sendStatus(500));
});

router.post("/", (req, res) => {
  models.periodo_lectivo
    .create({ id: req.body.id,nombre: req.body.nombre,anio_academico: req.body.anio_academico,fecha_inicio: req.body.fecha_inicio,fecha_fin: req.body.fecha_fin })
    .then(periodo_lectivo => res.status(201).send({ id: periodo_lectivo.id }))
    .catch(error => {
      if (error == "SequelizeUniqueConstraintError: Validation error") {
        res.status(400).send('Bad request: existe otro periodo con el mismo nombre')
      }
      else {
        console.log(`Error al intentar insertar en la base de datos: ${error}`)
        res.sendStatus(500)
      }
    });
});

const findPeriodo_lectivo = (id, { onSuccess, onNotFound, onError }) => {
  models.periodo_lectivo
    .findOne({
      attributes: ["id", "nombre"],
      where: { id }
    })
    .then(periodo_lectivo => (periodo_lectivo ? onSuccess(periodo_lectivo) : onNotFound()))
    .catch(() => onError());
};

router.get("/:id", (req, res) => {
    findPeriodo_lectivo(req.params.id, {
    onSuccess: periodo_lectivo => res.send(periodo_lectivo),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.put("/:id", (req, res) => {
  const onSuccess = periodo_lectivo =>
  periodo_lectivo
      .update({ id: req.body.id,nombre: req.body.nombre,anio_academico: req.body.anio_academico,fecha_inicio: req.body.fecha_inicio,fecha_fin: req.body.fecha_fin }, { fields: ["id", "nombre", "anio_academico", "fecha_inicio", "fecha_fin"] })
      .then(() => res.sendStatus(200))
      .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Bad request: existe otro periodo lectivo con el mismo nombre')
        }
        else {
          console.log(`Error al intentar actualizar la base de datos: ${error}`)
          res.sendStatus(500)
        }
      });
      findPeriodo_lectivo(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.delete("/:id", (req, res) => {
  const onSuccess = periodo_lectivo =>
  periodo_lectivo
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
      findPeriodo_lectivo(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

module.exports = router;
