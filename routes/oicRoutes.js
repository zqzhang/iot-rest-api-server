var express = require('express');
var os = require('os');
var OIC = require('../oic/oic');

var routes = function(iotivity) {
  var router = express.Router();

  router.route('/p')
    .get(function(req, res) {
      var handle = {};

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
          res.send(json);
          return iotivity.OCStackApplicationResult.OC_STACK_DELETE_TRANSACTION;
        },
        null,
        0 );
    });

  router.route('/d')
    .get(function(req, res) {
      var handle = {};

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
          res.send(json);
          return iotivity.OCStackApplicationResult.OC_STACK_DELETE_TRANSACTION;
        },
        null,
        0 );
    });

  router.route('/res')
    .get(function(req, res) {
      var handle = {};

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
          res.send(json);
          return iotivity.OCStackApplicationResult.OC_STACK_DELETE_TRANSACTION;
        },
        null,
        0 );
    });

  return router;
};

module.exports = routes;
