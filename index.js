var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var util = require('util');

var oic = require('./oic/oic');
var appfw = {}; //require('iot-appfw');

var app = express();
app.set('view engine', 'jade');
app.set('views', './views')

var port = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

appRouter = require('./routes/appRoutes')(appfw);
app.use('/api/apps', appRouter);

installRouter = require('./routes/installRoutes')(appfw);
app.use('/api/install', installRouter);

systemRouter = require('./routes/systemRoutes')();
app.use('/api/system', systemRouter);

oicRouter = require('./routes/oicRoutes')(oic);
app.use('/api/oic', oicRouter);

app.get('/', function(req, res) {
  res.render('main', {title: "IoT OS API Server", host: req.hostname, port: port});
});

app.listen(port, function() {
  console.log('Running on PORT: ' + port);
})
