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
      AppFW.listApps(false, callback);

      res.setTimeout(timeoutValue, function() {
        res.status(okStatusCode).end();
      });
    })
    .post(function(req, res) {
      var callback = function(id, status, msg, apps) {
        var error = null, appCount = 0, appList;

        if (status != 0) {
          error = 'Server failed to process the application request.';
        } else {
          appList = AppFW.extractAppInfo(apps, status, true, null);
          appCount = appList.length ? appList.length : 0;

          if (appCount == 0)
            error = 'Got list of 0 applications to restart.';
        }

        if (error) {
          res.status(errorStatusCode).send({ error: error});
        } else {
          var ps_callback = function(err, stdout, stderr) {
            if (err && res.finished == false)
              res.status(errorStatusCode).send({ error: 'Failed to start one or more applications.'});
          }

          for (var index = 0 ; index < appCount ; index++) {
            AppFW.startApp(appList[index]["app"], appList[index]["argv"], ps_callback);
          }
        }
      }
      AppFW.listApps(true, callback);

      res.setTimeout(timeoutValue, function() {
        res.status(okStatusCode).end();
      });
    })
    .delete(function(req, res) {
      var callback = function(id, status, msg, apps) {
        var error = null, appCount = 0, appList;

        if (status != 0) {
          error = 'Server failed to process the application request.';
        } else {
          appList = AppFW.extractAppInfo(apps, status, true, null);
          appCount = appList.length ? appList.length : 0;

          if (appCount == 0)
            error = 'Got list of 0 applications to restart';
        }

        if (error) {
          res.status(errorStatusCode).send({ error: error});
        } else {
          var ps_callback = function(err, stdout, stderr) {
            var result;
            if (err && res.finished == false)
              res.status(errorStatusCode).send({ error: 'Failed to stop one or more applications.'});
          }
          for (var index = 0 ; index < appCount ; index++) {
            AppFW.stopApp(appList[index]["app"], ps_callback);
          }
        }
      }
      AppFW.listApps(false, callback);

      res.setTimeout(timeoutValue, function() {
        res.status(okStatusCode).end();
      });
    })
    .put(function(req, res) {
      var callback = function(id, status, msg, apps) {
        var error = null, appCount = 0,appList;

        if (status != 0) {
          error = 'Server failed to process the application request.';
        } else {
          appList = AppFW.extractAppInfo(apps, status, true, null);
          appCount = appList.length ? appList.length : 0;

          if (appCount == 0)
            error = 'Got list of 0 applications to restart';
        }

        if (error) {
          res.status(errorStatusCode).send({ error: error});
        } else {
          var ps_callback = function(err, stdout, stderr) {
            if (err && res.finished == false)
              res.status(errorStatusCode).send({ error: 'Failed to restart one or more applications.'});
          }

          for (var index = 0 ; index < appCount ; index++) {
            AppFW.stopApp(appList[index]["app"], ps_callback);
            AppFW.startApp(appList[index]["app"], appList[index]["argv"], ps_callback);
          }
        }
      }
      AppFW.listApps(false, callback);

      res.setTimeout(timeoutValue, function() {
        res.status(okStatusCode).end();
      });
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
