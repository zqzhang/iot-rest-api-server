var express = require('express');
var os = require('os');

var routes = function() {
  var router = express.Router();

  router.route('/')
    .get(function(req, res) {
      var system = {};

      system.hostname = os.hostname();
      system.type = os.type();
      system.platform = os.platform();
      system.arch = os.arch();
      system.release = os.release();
      system.uptime = os.uptime();
      system.loadavg = os.loadavg();
      system.totalmem = os.totalmem();
      system.freemem = os.freemem();
      system.cpus = os.cpus();
      system.networkinterfaces = os.networkInterfaces();

      res.json(system);
    });
    return router;
};

module.exports = routes;
