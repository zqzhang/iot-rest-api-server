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
      var callback = function(id, status, msg, apps) {
        var error = null, appCount = 0, appList;

        if (status != 0) {
          error = 'Server failed to process the application request.';
        } else {
          appList = AppFW.extractAppInfo(apps, status, true, null);
          appCount = appList.length ? appList.length : 0;

          if (appCount == 0)
            error = 'Got list of 0 applications to update.';
        }

        if (error) {
          res.status(errorStatusCode).send({ error: error});
        } else {
          var ps_callback = function(err, stdout, stderr) {
            if (err && res.finished == false)
              res.status(errorStatusCode).send({ error: 'Failed to update one or more applications.'});
          }

          for (var index = 0 ; index < appCount ; index++) {
            AppFW.updateApp(appList[index]["app"], ps_callback);
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
            error = 'Got list of 0 applications to uninstall';
        }

        if (error) {
          res.status(errorStatusCode).send({ error: error});
        } else {
          var ps_callback = function(err, stdout, stderr) {
            var result;
            if (err && res.finished == false)
              res.status(errorStatusCode).send({ error: 'Failed to uninstall one or more applications.'});
          }
          for (var index = 0 ; index < appCount ; index++) {
            AppFW.uninstallApp(appList[index]["app"], ps_callback);
          }
        }
      }
      AppFW.listApps(true, callback);

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
            error = 'Got list of 0 applications to reinstall';
        }

        if (error) {
          res.status(errorStatusCode).send({ error: error});
        } else {
          var ps_callback = function(err, stdout, stderr) {
            if (err && res.finished == false)
              res.status(errorStatusCode).send({ error: 'Failed to reinstall one or more applications.'});
          }

          for (var index = 0 ; index < appCount ; index++) {
            AppFW.reinstallApp(appList[index]["app"], ps_callback);
          }
        }
      }
      AppFW.listApps(true, callback);

      res.setTimeout(timeoutValue, function() {
        res.status(okStatusCode).end();
      });
    });

  router.use('/:appId', function(req, res, next) {
    var callback = function(id, status, msg, apps) {
      if (status != 0) {
        req.error = 'Server failed to process the application request.';
      } else {
        req.app = AppFW.extractAppInfo(apps, status, false, req.params.appId);
        if (req.app.length == 0) {
          req.error = 'Got list of 0 applications to process the request.';
        }
      }

      if (req.error)
        res.status(errorStatusCode).send({ error: req.error });
      else
        next();
    }
    AppFW.listApps(true, callback);
  });

  router.route('/:appId')
    .get(function(req, res) {
      sendResponse(res, req.app);
    })
    .post(function(req, res) {
      var ps_callback = function(err, stdout, stderr) {
        if (err)
          res.status(errorStatusCode).send({ error: 'Failed to update the application.'});
        else
          res.status(okStatusCode).end();
      }
      AppFW.updateApp(req.app[0]["app"], ps_callback);

      res.setTimeout(timeoutValue, function() {
        res.status(okStatusCode).end();
      });
    })
    .delete(function(req, res) {
      var ps_callback = function(err, stdout, stderr) {
        var result;

        if (err)
          res.status(errorStatusCode).send({ error: 'Failed to uninstall the application.'});
        else
          res.status(okStatusCode).end();
      }
      AppFW.uninstallApp(req.app[0]["app"], ps_callback);

      res.setTimeout(timeoutValue, function() {
        res.status(okStatusCode).end();
      });
    })
    .put(function(req, res) {
      var ps_callback = function(err, stdout, stderr) {
        if (err && res.finished == false)
          res.status(errorStatusCode).send({ error: 'Failed to reinstall the application.'});
      }
      AppFW.reinstallApp(req.app[0]["app"], ps_callback);

      res.setTimeout(timeoutValue, function() {
        res.status(okStatusCode).end();
      });
    });

    return router;
};

module.exports = routes;
