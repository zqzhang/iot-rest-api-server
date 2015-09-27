var express = require('express');

var routes = function(AppFW) {
  var router = express.Router();

  var timeoutValue = 5000; // 5s
  var okStatusCode = 200; // OK
  var errorStatusCode = 500; // Error

  function sendResponse(res, result) {
    if (res.finished == false) {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(result));
    }
  }

  router.route('/')
    .get(function(req, res) {
      var callback = function(id, status, msg, apps) {
        var error = null, appList;
        if (status != 0) {
          error = "Server failed to process the application request.";
        } else {
          appList = AppFW.extractAppInfo(apps, status, true, null);

          if (appList.length == 0)
            error = "Got list of 0 applications running.";
        }

        if (error)
          res.status(errorStatusCode).send({ error: error});
        else
          sendResponse(res, appList);
      }
      AppFW.listApps(true, callback);

      res.setTimeout(timeoutValue, function() {
        res.status(okStatusCode).end();
      });
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
