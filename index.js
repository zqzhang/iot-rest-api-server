var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var util = require('util');
var systemd = require('systemd');
var device = require('iotivity-node')();
var http, https, fs = null;
var argv = require('minimist')(process.argv.slice(2));

const usage = "usage: node index.js [options]\n" +
"options: \n" +
"  -h, --help \n" +
"  -v, --verbose \n" +
"  -p, --port <number>\n" +
"  -s, --https \n";

if (argv.h == true || argv.help == true) {
  console.log(usage);
  return;
}

var port = 8000; /* default port */
if (typeof argv.p != "undefined")
  port = argv.p;
else if (typeof argv.port != "undefined")
  port = argv.port;

if (Number.isInteger(port) == false) {
  console.log(usage);
  return;
}

var appfw = "";
try {
  appfw = require('./appfw/appfw');
}
catch (e) {
  if (argv.v == true || argv.verbose == true)
    console.log("No AppFW module: " + e.message);
}

if (argv.s == true || argv.https == true) {
  fs = require('fs');
  https = require('https');

  var httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, 'config', 'private.key')),
    cert: fs.readFileSync(path.join(__dirname, 'config', 'certificate.pem'))
  };
}
else {
  http = require('http');
}

var app = express();

// Allow cross origin requests
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

appRouter = require('./routes/appRoutes')(appfw);
app.use('/api/apps', appRouter);

installRouter = require('./routes/installRoutes')(appfw);
app.use('/api/install', installRouter);

systemRouter = require('./routes/systemRoutes')();
app.use('/api/system', systemRouter);

oicRouter = require('./routes/oicRoutes')(device);
app.use('/api/oic', oicRouter);

port = process.env.LISTEN_PID > 0 ? 'systemd' : port;

if (argv.s == true || argv.https == true) {
  https.createServer(httpsOptions, app).listen(port);
  console.log('Running on https PORT: ' + port);
}
else {
  http.createServer(app).listen(port);
  console.log('Running on PORT: ' + port);
}
