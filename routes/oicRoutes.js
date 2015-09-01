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

  router.route('/:id/:resource')
    .get(function(req, res) {
      var handle = {}, serverIP = null, serverPort = null, connType = null;
     
      var callback = function(handle, response) {
        var json = OIC.parseRes(response.payload);
        serverIP = OIC.parseIP(response.addr.addr);
        serverPort = response.addr.port;
        connType = response.connType;

        var requestURI = "coap://" + serverIP + ":" + serverPort + req.path;
        rc = OIC.doGet(handle, requestURI, connType, function(handle, response) {
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
