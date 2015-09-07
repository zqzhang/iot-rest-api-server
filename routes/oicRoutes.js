var express = require('express');
var os = require('os');

var routes = function(OIC) {
  var router = express.Router();
  var timeoutValue = 5000; // 5s
  var timeoutStatusCode = 504; // Gateway Timeout

  OIC.init();

  router.route('/p')
    .get(function(req, res) {
      var handle = {};

      res.setTimeout(timeoutValue, function() {
        res.status(timeoutStatusCode).end();
      });
      var callback = function(handle, response) {
        var json = OIC.parseP(response.payload);
        res.setHeader('Content-Type', 'application/json');
        res.send(json);
        return OIC.deleteTransaction();
      }

      OIC.doDiscover(handle, "/oic/p", callback);
    });

  router.route('/d')
    .get(function(req, res) {
      var handle = {};

      res.setTimeout(timeoutValue, function() {
        res.status(timeoutStatusCode).end();
      });
      var callback = function(handle, response) {
        var json = OIC.parseD(response.payload);
        res.setHeader('Content-Type', 'application/json');
        res.send(json);
        return OIC.deleteTransaction();
      }

      OIC.doDiscover(handle, "/oic/d", callback);
    });

  router.route('/res')
    .get(function(req, res) {
      var handle = {};

      res.setTimeout(timeoutValue, function() {
        res.status(timeoutStatusCode).end();
      });
 
      var callback = function(handle, response) {
        var json = OIC.parseRes(response.payload);
        res.setHeader('Content-Type', 'application/json');
        res.send(json);
        return OIC.deleteTransaction();
      }

      OIC.doDiscover(handle, "/oic/res", callback);
    });

  router.param('resource', function(req, res, next, resource) {
    if (resource.match(";obs")) {
      req.url = req.url.slice(0, -4);
      req.obs = true;
    }
    next();
  });

  router.route('/:id/:resource')
    .get(function(req, res) {
      var handle = {};
      var callback = null;

      if (req.obs == true) {
        res.setHeader('Content-Type', 'application/json');
        callback = function(handle, response) {
          var rc = OIC.doObs(handle, req.url, response.addr, response.connType, function(handle, response) {
            var json = OIC.parseGet(response.payload);
            res.write(json);
            return OIC.keepTransaction()});

          return OIC.deleteTransaction();
        }
      }
      else {
        callback = function(handle, response) {
          var rc = OIC.doGet(handle, req.url, response.addr, response.connType, function(handle, response) {
            var json = OIC.parseGet(response.payload);
            res.setHeader('Content-Type', 'application/json');
            res.send(json);
            return OIC.deleteTransaction()});

          return OIC.deleteTransaction();
        }
      }

      OIC.doDiscover(handle, "/oic/res", callback);
    })
    .put(function(req, res) {
      var handle = {};

      var callback = function(handle, response) {
        var payload = {"type":4}
        payload.values = req.body;
        var rc = OIC.doPut(handle, req.url, response.addr, response.connType, payload, function(handle, response) {
          var json = OIC.parseGet(response.payload);
          res.setHeader('Content-Type', 'application/json');
          res.send(json);
          return OIC.deleteTransaction()});

        return OIC.deleteTransaction();
      }

      OIC.doDiscover(handle, "/oic/res", callback);
    });

  return router;
};

module.exports = routes;
