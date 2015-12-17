#!/usr/bin/env node

var proto = null;
var path = require('path');
var fs = require('fs');
var ca = null;
var commandLineArgs = require('command-line-args');

var cli = commandLineArgs([
  { name: 'help', alias: '?', type: Boolean, defaultValue: false },
  { name: 'verbose', alias: 'v', type: Boolean, defaultValue: false },
  { name: 'host', alias: 'h', type: String, defaultValue: 'localhost' },
  { name: 'port', alias: 'p', type: Number, defaultValue: 8000 },
  { name: 'https', alias: 's', type: Boolean, defaultValue: false },
  { name: 'obs', alias: 'o', type: Boolean, defaultValue: false }
]);

var cliOptions = cli.parse();

if (cliOptions.help) {
  console.log(cli.getUsage());
  return;
}

if (cliOptions.https) {
	ca = fs.readFileSync(path.join(__dirname, '..', 'config', 'certificate.pem'))
	proto = require('https');
}
else
	proto = require('http');

var reqOptions = {
	host: cliOptions.host,
	port: cliOptions.port,
	agent: new proto.Agent({keepAlive: true}),
	headers: {Connection: "keep-alive"},
	ca: ca
}

function findResources(callback) {
	reqOptions.path = "/api/oic/res";
	var json = "";
	discoveryCallback = function(res) {
		res.on('data', function(data) {
			json += data;
		});

		res.on('end', function() {
			var resources = JSON.parse(json);
			callback(resources);
		});
	}
	var req = proto.request(reqOptions, discoveryCallback);

	req.on('error', function(e) {
		console.log("HTTP Request error %s", e.message);
	});

	req.end();
}

function onResourceFound(resources) {
	console.log("--- onResourceFound:");

	for (var i = 0; i < resources.length; i++) {
		var uri = resources[i].links[0].href;
		console.log("%s : %s", resources[i].di, uri);
		retrieveResources(uri + "?di=" + resources[i].di, onResource, cliOptions.obs)
	}
}

function onResource(resource) {
	console.log("--- onResource:");
	console.log(resource)
}

function retrieveResources(uri, callback, obs) {
	reqOptions.path = "/api/oic" + uri;
	if (obs) {
		reqOptions.path += "&obs=1";
	}
	var json = "";
	resourceCallback = function(res) {
		res.on('data', function(data) {
			if (obs) {
				callback(JSON.parse(data));
			}
			else {
				json += data;
			}
		});

		res.on('end', function() {
			callback(JSON.parse(json));
		});

		res.on('abort', function() {
			console.log("event: abort");
		});
	}
	proto.request(reqOptions, resourceCallback).end();
}

findResources(onResourceFound);
