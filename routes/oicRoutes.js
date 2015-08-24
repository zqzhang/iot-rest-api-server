var express = require('express');
var os = require('os');
var OIC = require('../oic/oic');

var routes = function(iotivity) {
  var router = express.Router();
  var timeoutValue = 5000; // 5s
  var timeoutStatusCode = 504; // Gateway Timeout

  router.route('/p')
    .get(function(req, res) {
      var handle = {};

      res.setTimeout(timeoutValue, function() {
        res.status(timeoutStatusCode).end();
      });
      console.log("Request: " + req.path)
      iotivity.OCDoResource(
        handle,
        iotivity.OCMethod.OC_REST_DISCOVER,
        "/oic/p",
        null,
        null,
        iotivity.OCConnectivityType.CT_DEFAULT,
        iotivity.OCQualityOfService.OC_HIGH_QOS,
        function( handle, response ) {
          var json = OIC.parseP(response.payload);
          res.setHeader('Content-Type', 'application/json');
          res.send(json);
          return iotivity.OCStackApplicationResult.OC_STACK_DELETE_TRANSACTION;
        },
        null,
        0 );
    });

  router.route('/d')
    .get(function(req, res) {
      var handle = {};

      res.setTimeout(timeoutValue, function() {
        res.status(timeoutStatusCode).end();
      });
      console.log("Request: " + req.path)

      iotivity.OCDoResource(
        handle,
        iotivity.OCMethod.OC_REST_DISCOVER,
        "/oic/d",
        null,
        null,
        iotivity.OCConnectivityType.CT_DEFAULT,
        iotivity.OCQualityOfService.OC_HIGH_QOS,
        function( handle, response ) {
          var json = OIC.parseD(response.payload);
          res.setHeader('Content-Type', 'application/json');
          res.send(json);
          return iotivity.OCStackApplicationResult.OC_STACK_DELETE_TRANSACTION;
        },
        null,
        0 );
    });

  router.route('/res')
    .get(function(req, res) {
      var handle = {};

      res.setTimeout(timeoutValue, function() {
        res.status(timeoutStatusCode).end();
      });
      console.log("Request: " + req.path)

      iotivity.OCDoResource(
        handle,
        iotivity.OCMethod.OC_REST_DISCOVER,
        "/oic/res",
        null,
        null,
        iotivity.OCConnectivityType.CT_DEFAULT,
        iotivity.OCQualityOfService.OC_HIGH_QOS,
        function( handle, response ) {
          var json = OIC.parseRes(response.payload);
          res.setHeader('Content-Type', 'application/json');
          res.send(json);
          return iotivity.OCStackApplicationResult.OC_STACK_DELETE_TRANSACTION;
        },
        null,
        0 );
    });

  return router;
};

module.exports = routes;
