var express = require('express');
var os = require('os');

var routes = function(OIC) {
  var router = express.Router();
  var timeoutValue = 5000; // 5s
  var timeoutStatusCode = 504; // Gateway Timeout
  var notFoundStatusCode = 404; // Not found

  OIC.init();

  router.route('/p')
    .get(function(req, res) {
      var handle = {};

      res.setTimeout(timeoutValue, function() {
        res.status(timeoutStatusCode).end();
      });
      var callback = function(handle, response) {
        var json = OIC.parseP(response.payload);
        if (res.finished == false) {
          res.setHeader('Content-Type', 'application/json');
          res.send(json);
        }
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
        if (res.finished == false) {
          res.setHeader('Content-Type', 'application/json');
          res.send(json);
        }
        return OIC.deleteTransaction();
      }
      console.log("doDiscover: /oic/d");
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
        if (res.finished == false) {
          res.setHeader('Content-Type', 'application/json');
          res.send(json);
        }
        return OIC.deleteTransaction();
      }
      console.log("doDiscover: /oic/res");
      OIC.doDiscover(handle, "/oic/res", callback);
    });

  router.param('resource', function(req, res, next, resource) {
    if (req.url.match(";obs")) {
      req.url = req.url.slice(0, -4);
      req.obs = true;
    }
    next();
  });

  router.route('/:resource(([a-zA-Z0-9/]+)(;obs)?)')
    .get(function(req, res) {
      var handle = {};
      var callback = null;

      res.setTimeout(timeoutValue, function() {
        res.status(timeoutStatusCode).end();
      });

      if (req.obs == true) {
        res.setHeader('Content-Type', 'application/json');

        req.on('close', function() {
          console.log("Client: close");
          req.obs = false;
        });

        var observer = function(handle, response) {
            console.log("OBS: " + req.obs + ", handle: " + handle);
            if (req.obs == true && res.finished == false) {
              var json = OIC.parseGet(response.payload);
              res.write(json);
              return OIC.keepTransaction();
            } else {
              OIC.doCancel(handle);
              return OIC.deleteTransaction();
            }
        }

        callback = function(handle, response) {
          var rc = OIC.doObs(handle, req.url, response.addr, response.connType, observer);
          return OIC.deleteTransaction();
        }
      }
      else {
        callback = function(handle, response) {
          var rc = OIC.doGet(handle, req.url, response.addr, response.connType, function(handle, response) {
            if (response.result == 0 && res.finished == false) {
              var json = OIC.parseGet(response.payload);
              res.setHeader('Content-Type', 'application/json');
              res.send(json);
            } else {
              res.status(notFoundStatusCode).end();
            }
            return OIC.deleteTransaction()
          });
          return OIC.deleteTransaction();
        }
      }
      console.log("doDiscover: /oic/res (for get)");
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
