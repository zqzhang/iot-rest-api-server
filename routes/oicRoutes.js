var express = require('express');
var os = require('os');

var routes = function(iotivity) {
  var router = express.Router();

  router.route('/p')
    .get(function(req, res) {
      var handle = {};

      iotivity.OCDoResource(
        handle,
        iotivity.OCMethod.OC_REST_GET,
        "/oic/p",
        null,
        null,
        iotivity.OCConnectivityType.OC_ALL,
        iotivity.OCQualityOfService.OC_HIGH_QOS,
        function( handle, response ) {
          console.log( response );
          var json = JSON.parse(response.resJSONPayload);
          res.send(json.oic[0].rep);
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
        iotivity.OCMethod.OC_REST_GET,
        "/oic/d",
        null,
        null,
        iotivity.OCConnectivityType.OC_ALL,
        iotivity.OCQualityOfService.OC_HIGH_QOS,
        function( handle, response ) {
          console.log( response );
          var json = JSON.parse(response.resJSONPayload);
          res.send(json.oic[0].rep);
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
        iotivity.OCMethod.OC_REST_GET,
        "/oic/res",
        null,
        null,
        iotivity.OCConnectivityType.OC_ALL,
        iotivity.OCQualityOfService.OC_HIGH_QOS,
        function( handle, response ) {
          console.log( response );
          var json = JSON.parse(response.resJSONPayload);
          res.send(json.oic[0]);
          return iotivity.OCStackApplicationResult.OC_STACK_DELETE_TRANSACTION;
        },
        null,
        0 );
    });

  return router;
};

module.exports = routes;
