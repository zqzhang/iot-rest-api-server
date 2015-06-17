var express = require('express');

var routes = function(AppFW) {
  var router = express.Router();

  router.route('/')
    .get(function(req, res) {
      var json = {"description": "List all apps", "note": "Not implemented yet."}
      console.log("GET " + req.path);
      res.json(json);
    })
    .post(function(req, res) {
      var json = {"description": "Start all apps", "note": "Not implemented yet."}
      console.log("POST" + req.path);
      res.status(201).send(json);
    })
    .put(function(req, res) {
      var json = {"description": "Restart all apps", "note": "Not implemented yet."}
      console.log("POST" + req.path);
      res.status(201).send(json);
    })
    .delete(function(req, res) {
      var json = {"description": "Stop all apps", "note": "Not implemented yet."}
      console.log("POST" + req.path);
      res.status(201).send(json);
    });

  router.use('/:appId', function(req, res, next) {
    var app = {"id": req.params.appId, "description": "Single App", "note": "Not implemented yet."}
    req.app = app;
    next();
  });

  router.route('/:appId')
    .get(function(req, res) {
      res.json(req.app);
    })
    .post(function(req, res) {
      res.json(req.app);
    })
    .put(function(req, res) {
      res.json(req.app);
    })
    .delete(function(req, res) {
      res.json(req.app);
    });

    return router;
};

module.exports = routes;
