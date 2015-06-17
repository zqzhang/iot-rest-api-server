var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var util = require('util');

var iotivity = require('iotivity');
var appfw = {}; //require('iot-appfw');

iotivity.OCInit( null, 0, iotivity.OCMode.OC_CLIENT );

intervalId = setInterval( function() {
  iotivity.OCProcess();
}, 100 );

var app = express();
app.set('view engine', 'jade');
app.set('views', './views')

var port = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

appRouter = require('./routes/appRoutes')(appfw);
app.use('/api/apps', appRouter);

systemRouter = require('./routes/systemRoutes')();
app.use('/api/system', systemRouter);

oicRouter = require('./routes/oicRoutes')(iotivity);
app.use('/api/oic', oicRouter);

app.get('/', function(req, res) {
  res.render('main', {title: "IoT OS API Server", port: port});
});

app.listen(port, function() {
  console.log('Running on PORT: ' + port);
})
