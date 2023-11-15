var express = require("express");
var router = express.Router();
var models = require("../models");
/**
 * @swagger
 * components:
 *  schemas:
 *    Docente:
 *     type: object
 *     properties:
 *       nombre:
 *         type: string
 *         description: el nombre del docente
 *       apellido:
 *         type: string
 *         description: el apellido del docente
 *       dni:
 *         type: string
 *         description: el dni del docente
 *       estado:
 *         type: string(1)
 *         description: el estado del docente(A/P)
 *     example:
 *       nombre: Diego
 *       apellido: Maradona  
 *       dni: 12345678X 
 *       estado: P
*/

/**
 * @swagger
 * /doc:
 *  get:
 *    summary: Retorna todos los docentes
 *    tags: [Docente]
 *    responses:
 *      200:
 *        description: Todos los docentes
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Docente'       
 */

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

/**
 * @swagger
 * /doc:
 *  post:
 *    summary: Crea un nuevo Docente
 *    tags: [Docente]
 *    requestBody: 
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/Docente'
 *    responses:
 *      200:
 *        description: nuevo Docente creado! 
 */

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

/**
 * @swagger
 * /doc/{id}:
 *  get:
 *    summary: Retorna un docente
 *    tags: [Docente]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: El id del docente
 *    responses:
 *      200:
 *        description: un docente
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Docente'
 *      404:
 *        description:  el docente no existe    
 */

router.get("/:id", (req, res) => {
    findDocente(req.params.id, {
    onSuccess: docente => res.send(docente),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

/**
 * @swagger
 * /doc/{id}:
 *  put:
 *    summary: actualiza un docente
 *    tags: [Docente]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: El id del docente
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type : object
 *            $ref: '#/components/schemas/Docente'
 *    responses:
 *      200:
 *        description: docente actualizado
 *      404:
 *        description:  el docente no existe    
 */

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

/**
 * @swagger
 * /doc/{id}:
 *  delete:
 *    summary: elimina un docente
 *    tags: [Docente]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: El id del docente
 *    responses:
 *      200:
 *        description: docente eliminado
 *      404:
 *        description:  el docente no existe    
 */

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
