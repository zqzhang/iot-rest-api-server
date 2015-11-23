var express = require('express');
var OIC = require('../oic/oic');

const RESOURCE_FOUND_EVENT = "resourcefound";
const RESOURCE_CHANGE_EVENT = "resourcechange";
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

      discoveredDevices.length = 0;
      DEV.client.addEventListener(DEVICE_FOUND_EVENT, onDeviceFound);

      console.log("Discovering devices for %d seconds.", timeoutValue/1000);
      DEV.client.findDevices().then(function() {
        // TODO: should we send in-progress back to http-client
        console.log("findDevices() successful");
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

      discoveredResources.length = 0;
      DEV.client.addEventListener(RESOURCE_FOUND_EVENT, onResourceFound);

      console.log("Discovering resources for %d seconds.", timeoutValue/1000);
      DEV.client.findResources().then(function() {
        // TODO: should we send in-progress back to http-client
        console.log("findResources() successful");
      })
      .catch(function(e) {
        console.log(e);
        res.status(internalErrorStatusCode).send(e.message);
      });
    });

  router.route('/:resource(([a-zA-Z0-9\.\/\+-]+)(;obs)?)/')
    .get(function(req, res) {

      if (typeof req.query.id == "undefined") {
        res.status(badRequestStatusCode).send("Query parameter \"id\" is missing.");
        return;
      }
      console.log("GET %s", req.originalUrl);
      if (req.query.obs != "undefined" && req.query.obs == true) {
        req.on('close', function() {
          console.log("Client: close");
          req.query.obs = false;
        });

        function observer(event) {
          console.log("obs: " + req.query.obs + ", fin: " + res.finished + ", id: " + req.query.id);
          if (req.query.obs == true && res.finished == false) {
            var json = OIC.parseResource(event.resource);
            res.write(json);
          } else {
            DEV.client.removeEventListener(RESOURCE_CHANGE_EVENT, observer);
            DEV.client.cancelObserving(req.query.id);
          }
        }
        DEV.client.addEventListener(RESOURCE_CHANGE_EVENT, observer);

        DEV.client.startObserving(req.query.id).then(
          function(resource) {
            console.log("Start observing successful: " + req.query.id);
          },
          function(e) {
            res.status(internalErrorStatusCode).send("Resource observing failed: " + e.message);
          }
        );
      }
      else {
        res.setTimeout(timeoutValue, function() {
          res.status(notFoundStatusCode).send("Resource not found.");
        });

        DEV.client.retrieveResource(req.query.id).then(
          function(resource) {
            var json = OIC.parseResource(resource);
            res.setHeader('Content-Type', 'application/json');
            res.send(json);
          },
          function(error) {
            res.status(internalErrorStatusCode).send("Resource retrieve failed: " + e.message);
        });
      }
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
