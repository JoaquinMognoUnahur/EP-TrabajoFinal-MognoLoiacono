var express = require("express");
var router = express.Router();
var models = require("../models");

/**
 * @swagger
 * components:
 *  schemas:
 *    Carrera:
 *      type: object
 *      properties:
 *        nombre:
 *          type: string
 *          description: Nombre de la carrera
 *      example:
 *        nombre: Licenciatura en Informática
 */

/**
 * @swagger
 * /car:
 *  get:
 *    summary: Devuelve todas las carreras
 *    tags: [Carrera]
 *    responses:
 *      200:
 *        description: Todas las carreras
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Carrera'       
 */


router.get("/", (req, res) => {

  let pagina = parseInt(req.query.pagina);
  let cantPorPag = parseInt(req.query.cantPorPag);

  pagina = isNaN(pagina) || pagina <= 0 ? 1 : pagina;
  cantPorPag = isNaN(cantPorPag) || cantPorPag <= 0 ? 5 : cantPorPag;

  console.log("Esto es un mensaje para ver en consola");
  models.carrera
    .findAndCountAll({
      attributes: ["id", "nombre"],
    
      limit: cantPorPag,
      offset: (pagina - 1) * (cantPorPag),
      distinct: true

    })
    .then(resp => {
      const totalElementos = resp.count;
      const carreras = resp.rows;
      const totalPaginas = Math.ceil(totalElementos/cantPorPag);

      res.send({
        totalElementos,
        totalPaginas,
        paginaNro: pagina,
        carreras
      })
    })
    .catch(() => res.sendStatus(500));
});


/**
 * @swagger
 * /car:
 *  post:
 *    summary: Crea una nueva carrera
 *    tags: [Carrera]
 *    requestBody: 
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/Carrera'
 *    responses:
 *      200:
 *        description: nueva Carrera creada! 
 */

router.post("/", (req, res) => {
  models.carrera
    .create({ nombre: req.body.nombre })
    .then(carrera => res.status(201).send({ id: carrera.id }))
    .catch(error => {
      if (error == "SequelizeUniqueConstraintError: Validation error") {
        res.status(400).send('Bad request: existe otra carrera con el mismo nombre')
      }
      else {
        console.log(`Error al intentar insertar en la base de datos: ${error}`)
        res.sendStatus(500)
      }
    });
});

const findCarrera = (id, { onSuccess, onNotFound, onError }) => {
  models.carrera
    .findOne({
      attributes: ["id", "nombre"],
      where: { id }
    })
    .then(carrera => (carrera ? onSuccess(carrera) : onNotFound()))
    .catch(() => onError());
};


/**
 * @swagger
 * /car/{id}:
 *  get:
 *    summary: Retorna una carrera
 *    tags: [Carrera]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: El id de la carrera
 *    responses:
 *      200:
 *        description: una carrera
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Carrera'
 *      404:
 *        description:  la carrera no existe    
 */
router.get("/:id", (req, res) => {
  findCarrera(req.params.id, {
    onSuccess: carrera => res.send(carrera),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});
/**
 * @swagger
 * /car/{id}:
 *  put:
 *    summary: Actualiza una carrera
 *    tags: [Carrera]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: El id de la carrera
 *    requestBody: 
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/Carrera'
 *    responses:
 *      200:
 *        description: Carrera actualizada
 *      404:
 *        description: La carrera no existe    
 */

router.put("/:id", (req, res) => {
  const onSuccess = carrera =>
    carrera
      .update({ nombre: req.body.nombre }, { fields: ["nombre"] })
      .then(() => res.sendStatus(200))
      .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Bad request: existe otra carrera con el mismo nombre')
        }
        else {
          console.log(`Error al intentar actualizar la base de datos: ${error}`)
          res.sendStatus(500)
        }
      });
    findCarrera(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

/**
 * @swagger
 * /car/{id}:
 *  delete:
 *    summary: Elimina una carrera
 *    tags: [Carrera]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: El id de la carrera
 *    responses:
 *      200:
 *        description: Carrera eliminada
 *      404:
 *        description: La carrera no existe      
 */
router.delete("/:id", (req, res) => {
  const onSuccess = carrera =>
    carrera
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findCarrera(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

module.exports = router;
