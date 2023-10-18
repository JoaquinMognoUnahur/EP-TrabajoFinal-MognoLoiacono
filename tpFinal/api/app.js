var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var alumnosRouter = require('./routes/alumnos');
var carrerasRouter = require('./routes/carreras');
var comisionesRouter = require('./routes/comisions');
var docentesRouter = require('./routes/docentes');
var materiasRouter = require('./routes/materias');
var periodo_lectivosRouter = require('./routes/periodo_lectivos');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
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