var createError = require('http-errors');
//var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var alumnosRouter = require('./routes/alumnos');
var carrerasRouter = require('./routes/carreras');
var comisionesRouter = require('./routes/comisions');
var docentesRouter = require('./routes/docentes');
var materiasRouter = require('./routes/materias');
var periodo_lectivosRouter = require('./routes/periodo_lectivos');
//var app = express();

//var jwt = require('jsonwebtoken');
//var keys = require('./config/keys')
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const keys = require('./config/keys');
app.set('key', keys.key);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());



app.post('/login', (req, res)=>{
  if(req.body.usuario == 'admin'&& req.body.pass == '12345'){
    const payload = {
      check:true
    };
    const token = jwt.sign(payload, app.get('key'),{
      expiresIn:'7d'
    });
    res.json({
      message:'Autenticación exitosa!',
      token: token
    });
  }else{
    res.json({
      message:'Usuario y/o contraseña incorrectas'
    })
  }
});

const verificacion = express.Router();

verificacion.use((req, res, next)=>{
  let token = req.headers['x-access-token'] || req.headers['authorization'];
  //console.log(token);
  if(!token){
    res.status(401).send({
      error:'Es necesario un token de autentificación'
    })
    return
  }
  if(token.startsWith('Bearer ')){
    token = token.slice(7,token.length)
    console.log(token)
  }
  if(token){
    jwt.verify(token, app.get('key'), (error, decoded)=>{
      if(error){
        return res.json({
          message:'El token no es valido'
        });
      }else{
         req.decoded = decoded;
         next();
      }
    })
  }
});

app.get('/info', verificacion, (req, res)=>{
  res.json('INFORMACION IMPORTANTE ENTREGADA');
})


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/alum', alumnosRouter);
app.use('/car', carrerasRouter);
app.use('/com', comisionesRouter);
app.use('/doc', docentesRouter);
app.use('/mat', materiasRouter);
app.use('/per', periodo_lectivosRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;