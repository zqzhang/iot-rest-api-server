var express = require('express');
var OIC = require('../oic/oic');

const RESOURCE_FOUND_EVENT = "resourcefound";
const DEVICE_FOUND_EVENT = "devicefound";

const timeoutValue = 5000; // 5s
const timeoutStatusCode = 504; // Gateway Timeout

const noContentStatusCode = 204; // No content
const internalErrorStatusCode = 500; // Internal error
const badRequestStatusCode = 400; // Bad request
const notFoundStatusCode = 404; // Not found

var routes = function(DEV) {
  var router = express.Router();
  var discoveredResources = [];
  var discoveredDevices = [];

  DEV.configure({
    role: "client",
    connectionMode: "acked"
  });

  function onResourceFound(event) {
    var resource = OIC.parseRes(event);
    discoveredResources.push(resource);
  }

  function onDeviceFound(event) {
    var device = OIC.parseDevice(event);
    discoveredDevices.push(device);
  }

  router.route('/p')
    .get(function(req, res) {
      res.status(badRequestStatusCode).send("/oic/p not supported.");
    });

  router.route('/d')
    .get(function(req, res) {
      res.setTimeout(timeoutValue, function() {
        DEV.client.removeEventListener(DEVICE_FOUND_EVENT, onDeviceFound);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(discoveredDevices));
      });

      console.log("GET %s", req.originalUrl);
      DEV.client.findDevices().then(function() {
        // TODO: should we send in-progress back to http-client
        console.log("Discovering devices for %d seconds.", timeoutValue/1000);
        discoveredDevices.length = 0;
        DEV.client.addEventListener(DEVICE_FOUND_EVENT, onDeviceFound);
      })
      .catch(function(e) {
        console.log("Error: " + e.message);
        res.status(internalErrorStatusCode).send(e.message);
      });
    });

  router.route('/res')
    .get(function(req, res) {
      res.setTimeout(timeoutValue, function() {
        DEV.client.removeEventListener(RESOURCE_FOUND_EVENT, onResourceFound);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(discoveredResources));
      });

      console.log("GET %s", req.originalUrl);
      DEV.client.findResources().then(function() {
        // TODO: should we send in-progress back to http-client
        console.log("Discovering resources for %d seconds.", timeoutValue/1000);
        discoveredResources.length = 0;
        DEV.client.addEventListener(RESOURCE_FOUND_EVENT, onResourceFound);
      })
      .catch(function(e) {
        console.log(e);
        res.status(internalErrorStatusCode).send(e.message);
      });
    });

  router.param('resource', function(req, res, next, resource) {
    if (req.url.match(";obs")) {
      req.url = req.url.slice(0, -4);
      req.obs = true;
    }
    next();
  });

  router.route('/:resource(([a-zA-Z0-9\.\/\+-]+)(;obs)?)/')
    .get(function(req, res) {

      if (typeof req.query.id == "undefined") {
        res.status(badRequestStatusCode).send("Query parameter \"id\" is missing.");
        return;
      }

      res.setTimeout(timeoutValue, function() {
        res.status(notFoundStatusCode).send("Resource not found.");
      });

      console.log("GET %s", req.originalUrl);
      DEV.client.retrieveResource(req.query.id).then(
        function(resource) {
          var json = OIC.parseResource(resource);
          res.setHeader('Content-Type', 'application/json');
          res.send(json);
        },
        function(error) {
          res.status(internalErrorStatusCode).send("Resource retrieve failed.");
      });
    })
    .put(function(req, res) {
      if (typeof req.query.id == "undefined") {
        res.status(badRequestStatusCode).send("Query parameter \"id\" is missing.");
        return;
      }

      res.setTimeout(timeoutValue, function() {
        res.status(notFoundStatusCode).send("Resource not found.");
      });

      var payload = {properties: req.body};
      console.log("PUT %s: %s", req.originalUrl, JSON.stringify(payload));
      DEV.client.updateResource(req.query.id, payload).then(
        function() {
          res.status(noContentStatusCode).send();
        },
        function(error) {
          console.log("Error: " + error.message);
          res.status(internalErrorStatusCode).send("Resource update failed: " + error.message);
      });

    });

  return router;
};

module.exports = routes;
