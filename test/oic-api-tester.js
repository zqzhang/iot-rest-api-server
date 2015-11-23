#!/usr/bin/env node

var http = require('http');
var agent = new http.Agent({keepAlive: true});

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

var reqOptions = {
	host: cliOptions.host,
	port: cliOptions.port,
	agent: agent,
	headers: {Connection: "keep-alive"}
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
	var req = http.request(reqOptions, discoveryCallback);

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
		retrieveResources(uri, onResource, cliOptions.obs)
	}
}

function onResource(resource) {
	console.log("--- onResource:");
	console.log("%s : %s", resource.href, JSON.stringify(resource.properties));
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
	http.request(reqOptions, resourceCallback).end();
}

findResources(onResourceFound);
