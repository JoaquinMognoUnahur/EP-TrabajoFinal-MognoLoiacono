var express = require("express");
var router = express.Router();
var models = require("../models");

/**
 * @swagger
 * components:
 *  schemas:
 *    Alumno:
 *     type: object
 *     properties:
 *       nombre:
 *         type: string
 *         description: el nombre del alumno
 *       apellido:
 *         type: string
 *         description: el apellido del alumno
 *       dni:
 *         type: string
 *         description: el dni del alumno
 *       sexo:
 *         type: string
 *         description: el sexo del alumno
 *       fecha_nacimiento:
 *         type: DATE
 *         description: la fecha de nacimiento del alumno
 *       nacionalidad:
 *         type: string
 *         description: la nacionalidad del alumno
 *       email:
 *         type: string
 *         description: el email del alumno 
 *       id_carrera:
 *         type: INTEGER
 *         description: el id de la carrera del alumno
 *     example:
 *       nombre: Lionel
 *       apellido: Messi  
 *       dni: 12345679 
 *       sexo: Masculino
 *       fecha_nacimiento: 1990-01-15T00:00:00.000Z
 *       nacionalidad: Argentina
 *       email: lionel.messi@example.com
 *       id_carrera: 1        
 * 
*/

/**
 * @swagger
 * /alum:
 *  get:
 *    summary: Retorna todos los alumnos
 *    tags: [Alumno]
 *    responses:
 *      200:
 *        description: Todos los alumnos
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Alumno'       
 */
router.get("/", (req, res) => {
  // Obtiene el número de página y la cantidad de elementos por página desde la consulta HTTP
  let pagina = parseInt(req.query.pagina);
  let cantPorPag = parseInt(req.query.cantPorPag);

// Verifica si los valores son números válidos; si no, asigna valores predeterminados
  pagina = isNaN(pagina) || pagina <= 0? 1 : pagina;
  cantPorPag = isNaN(cantPorPag) || cantPorPag <= 0? 5 : cantPorPag;

  models.alumno.findAndCountAll({attributes: ["id","nombre","apellido","dni","sexo","fecha_nacimiento","nacionalidad","email","id_carrera"],
      /////////se agrega la asociacion 
      include:[{as:'Carrera-Alumno', model:models.carrera, attributes: ["id","nombre"]}],
      ////////////////////////////////

      limit: cantPorPag,
      offset: (pagina-1) * (cantPorPag) // Por ejemplo si queremos la pagina 3, con 5 registros x pagina, haciendo el calculo te devuelve 10, que son los registor anteriores a los mostrados(11 a 15) 
}).then(resp => {
  const totalElementos = resp.count;
  const alumnos = resp.rows;
  const totalPaginas = Math.ceil(totalElementos/cantPorPag);

  res.send({
    totalElementos,
    totalPaginas,
    paginaNro: pagina,
    alumnos
  })
}).catch(() => res.sendStatus(500));
});


/**
 * @swagger
 * /alum:
 *  post:
 *    summary: Crea un nuevo Alumno
 *    tags: [Alumno]
 *    requestBody: 
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/Alumno'
 *    responses:
 *      200:
 *        description: nuevo Alumno creado! 
 */
router.post("/", (req, res) => {
  models.alumno
    .create({ id: req.body.id,nombre: req.body.nombre,apellido: req.body.apellido,dni: req.body.dni, sexo: req.body.sexo, fecha_nacimiento: req.body.fecha_nacimiento, nacionalidad: req.body.nacionalidad, email: req.body.email, id_carrera: req.body.id_carrera })
    .then(alumno => res.status(201).send({ id: alumno.id }))
    .catch(error => {
      if (error == "SequelizeUniqueConstraintError: Validation error") {
        res.status(400).send('Bad request: existe otro alumno con el mismo ID')
      }
      else {
        console.log(`Error al intentar insertar en la base de datos: ${error}`)
        res.sendStatus(500)
      }
    });
});

const findAlumno = (id, { onSuccess, onNotFound, onError }) => {
  models.alumno
    .findOne({
      attributes: ["id","nombre","apellido","dni","sexo","fecha_nacimiento","nacionalidad","email","id_carrera"],
      include:[{as:'Carrera-Alumno', model:models.carrera, attributes: ["id","nombre"]}],
      where: { id }
      
    })
    .then(alumno => (alumno ? onSuccess(alumno) : onNotFound()))
    .catch(() => onError());
};


/**
 * @swagger
 * /alum/{id}:
 *  get:
 *    summary: Retorna un alumno
 *    tags: [Alumno]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: El id del alumno
 *    responses:
 *      200:
 *        description: un alumnos
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Alumno'
 *      404:
 *        description:  el alumno no existe    
 */

router.get("/:id", (req, res) => {
  findAlumno(req.params.id, {
    onSuccess: alumno => res.send(alumno),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

/**
 * @swagger
 * /alum/{id}:
 *  put:
 *    summary: actualiza un alumno
 *    tags: [Alumno]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: El id del alumno
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type : object
 *            $ref: '#/components/schemas/Alumno'
 *    responses:
 *      200:
 *        description: Alumno actualizado
 *      404:
 *        description:  el alumno no existe    
 */

router.put("/:id", (req, res) => {
  const onSuccess = alumno =>
    alumno
      .update({ id: req.body.id,nombre: req.body.nombre,apellido: req.body.apellido,dni: req.body.dni, sexo: req.body.sexo, fecha_nacimiento: req.body.fecha_nacimiento, nacionalidad: req.body.nacionalidad, email: req.body.email, id_carrera: req.body.id_carrera }, { fields: ["nombre","apellido","dni","sexo","fecha_nacimiento","nacionalidad","email","id_carrera"] })
      .then(() => res.sendStatus(200))
      .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Bad request: existe otro alumno con el mismo ID')
        }
        else {
          console.log(`Error al intentar actualizar la base de datos: ${error}`)
          res.sendStatus(500)
        }
      });
    findAlumno(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});



/**
 * @swagger
 * /alum/{id}:
 *  delete:
 *    summary: elimina un alumno
 *    tags: [Alumno]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: El id del alumno
 *    responses:
 *      200:
 *        description: Alumno eliminado
 *      404:
 *        description:  el alumno no existe    
 */
router.delete("/:id", (req, res) => {
  const onSuccess = alumno =>
    alumno
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findAlumno(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

module.exports = router;
