var express = require('express');

var routes = function(AppFW) {
  var router = express.Router();

  router.route('/')
    .get(function(req, res) {
      var json = {"description": "List all installed apps", "note": "Not implemented yet."}
      console.log("GET " + req.path);
      res.json(json);
    })
    .post(function(req, res) {
      var json = {"description": "Update all installed apps", "note": "Not implemented yet."}
      console.log("POST" + req.path);
      res.status(201).send(json);
    })
    .put(function(req, res) {
      var json = {"description": "Reinstall all apps", "note": "Not implemented yet."}
      console.log("POST" + req.path);
      res.status(201).send(json);
    })
    .delete(function(req, res) {
      var json = {"description": "Uninstall all apps", "note": "Not implemented yet."}
      console.log("POST" + req.path);
      res.status(201).send(json);
    });

  router.use('/:appId', function(req, res, next) {
    var app = {"id": req.params.appId, "description": "Single App install", "note": "Not implemented yet."}
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
