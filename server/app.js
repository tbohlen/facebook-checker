var express = require("express");
var jade = require("jade");
var app = express.createServer();


app.configure(function(){
  app.set("views", __dirname + "/../views");
  app.set("view engine", "jade");
  app.set("view options", {layout: false});

  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.compiler({ src: __dirname + '/../public', enable: ['less'] }));
  app.use(app.router);
  app.use(express.static(__dirname + '/../public', {maxAge: 31557600000}));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
     app.use(express.errorHandler()); 
});

/*
 * Route: ^/?$
 * Description...
 */
app.get('^/?$', function(req, res, next){
    res.render("home.jade", {layout: false});
});

app.listen(8080);
