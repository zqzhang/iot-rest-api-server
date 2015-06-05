var express = require('express');

var routes = function(App) {
  var router = express.Router();

  router.route('/')
    .post(function(req, res) {
      var app = new App(req.body);
      app.save();
      console.log(app);
      res.status(201).send(app);

    })
    .get(function(req, res) {
      var query = {};

      if (req.query.genre)
        query.genre = req.query.genre;

      App.find(query, function(err, app) {
        if(err)
          res.status(500).send(err);
        else
          res.json(app);
      });
    });

  router.use('/:appId', function(req, res, next) {
    App.findById(req.params.appId, function(err, app) {
      if (err) {
        res.status(500).send(err);
      }
      else if(app) {
        req.app = app;
        next();
      }
      else {
        res.status(404).send('no app found');
      }
    });
  });

  router.route('/:appId')
    .get(function(req, res) {
      res.json(req.app);
    })
    .put(function(req, res) {
      req.app.title = req.body.title;
      req.app.author = req.body.author;
      req.app.genre = req.body.genre;
      req.app.read = req.body.read;
      req.app.save(function(err) {
        if (err)
          res.status(500).send(err);
        else
          res.json(req.app);
      });
    })
    .patch(function(req, res) {
      if(req.body._id)
        delete req.body._id;
      for (var p in req.body) {
        req.app[p] = req.body[p];
      }
      req.app.save(function(err) {
        if (err)
          res.status(500).send(err);
        else
          res.json(req.app);
      });
    });

    return router;
};

module.exports = routes;
