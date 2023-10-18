var express = require("express");
var router = express.Router();
var models = require("../models");

router.get("/", (req, res) => {

  let pagina = parseInt(req.query.pagina);
  let cantPorPag = parseInt(req.query.cantPorPag);

  pagina = isNaN(pagina) || pagina <= 0? 1 : pagina;
  cantPorPag = isNaN(cantPorPag) || cantPorPag <= 0? 5 : cantPorPag;


  console.log("Esto es un mensaje para ver en consola");
  models.docente
    .findAndCountAll({
      attributes: ["id", "nombre", "apellido", "dni", "estado"],
      
      limit: cantPorPag,
      offset: (pagina-1) * (cantPorPag)
    
}).then(resp => {
  const totalElementos = resp.count;
  const docentes = resp.rows;
  const totalPaginas = Math.ceil(totalElementos/cantPorPag);

  res.send({
    totalElementos,
    totalPaginas,
    paginaNro: pagina,
    docentes
  })
}).catch(() => res.sendStatus(500));
});

router.post("/", (req, res) => {
  models.docente
    .create({ id: req.body.id,nombre: req.body.nombre,apellido: req.body.apellido,dni: req.body.dni,estado: req.body.estado })
    .then(docente => res.status(201).send({ id: docente.id }))
    .catch(error => {
      if (error == "SequelizeUniqueConstraintError: Validation error") {
        res.status(400).send('Bad request: existe otro docente con el mismo nombre')
      }
      else {
        console.log(`Error al intentar insertar en la base de datos: ${error}`)
        res.sendStatus(500)
      }
    });
});

const findDocente = (id, { onSuccess, onNotFound, onError }) => {
  models.docente
    .findOne({
      attributes: ["id", "nombre", "apellido", "dni", "estado"],
      where: { id }
    })
    .then(docente => (docente ? onSuccess(docente) : onNotFound()))
    .catch(() => onError());
};

router.get("/:id", (req, res) => {
    findDocente(req.params.id, {
    onSuccess: docente => res.send(docente),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.put("/:id", (req, res) => {
  const onSuccess = docente =>
  docente
      .update({ id: req.body.id,nombre: req.body.nombre,apellido: req.body.apellido,dni: req.body.dni,estado: req.body.estado }, { fields: ["id", "nombre", "apellido", "dni", "estado"] })
      .then(() => res.sendStatus(200))
      .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Bad request: existe otro docente con el mismo dni')
        }
        else {
          console.log(`Error al intentar actualizar la base de datos: ${error}`)
          res.sendStatus(500)
        }
      });
      findDocente(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.delete("/:id", (req, res) => {
  const onSuccess = docente =>
  docente
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
      findDocente(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

module.exports = router;
