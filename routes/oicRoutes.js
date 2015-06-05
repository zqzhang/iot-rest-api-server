var express = require('express');
var os = require('os');

var routes = function(iotivity) {
  var router = express.Router();

  router.route('/p')
    .get(function(req, res) {
      var platform = {"p": "platform"};
      res.json(platform);
    });

  router.route('/d')
    .get(function(req, res) {
      var devices = {"d": "devices"};
      res.json(devices);
    });

  router.route('/res')
    .get(function(req, res) {
      var r = {"res": "resources"};
      var handle = {};

      iotivity.OCDoResource(
        handle,
        iotivity.OCMethod.OC_REST_GET,
        "light",
        null,
        null,
        iotivity.OCConnectivityType.OC_ALL,
        iotivity.OCQualityOfService.OC_HIGH_QOS,
        function( handle, response ) {
          console.log( "OCDoResource() handler: Entering" );
          res.json(response);
          return iotivity.OCStackApplicationResult.OC_STACK_DELETE_TRANSACTION;
        },
        null,
        0 );

      res.json(r);
    });

  return router;
};

module.exports = routes;
