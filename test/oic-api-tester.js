#!/usr/bin/env node

var proto = null;
var path = require('path');
var fs = require('fs');
var ca = null;
var argv = require('minimist')(process.argv.slice(2));

const usage = "usage: node oic-api-tester.js [options]\n" +
"options: \n" +
"  -?, --help \n" +
"  -v, --verbose \n" +
"  -h, --host <string>\n" +
"  -p, --port <number>\n" +
"  -s, --https \n" +
"  -o, --obs \n";

if (argv.h == true || argv.help == true) {
  console.log(usage);
  return;
}

var obs = false;
if (argv.o == true || argv.obs == true)
	obs = true

var port = 8000; /* default port */
if (typeof argv.p != "undefined")
  port = argv.p;
else if (typeof argv.port != "undefined")
  port = argv.port;

if (Number.isInteger(port) == false) {
  console.log(usage);
  return;
}

var host = "localhost"; /* default host */
if (typeof argv.h != "undefined")
  host = argv.h;
else if (typeof argv.host != "undefined")
  host = argv.host;

if (typeof host != "string") {
  console.log(usage);
  return;
}

if (argv.s == true || argv.https == true) {
	ca = fs.readFileSync(path.join(__dirname, '..', 'config', 'certificate.pem'))
	proto = require('https');
}
else
	proto = require('http');

var reqOptions = {
	host: host,
	port: port,
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
		retrieveResources(uri + "?di=" + resources[i].di, onResource, obs)
	}
}

function onResource(resource) {
	console.log("--- onResource:");
	console.log(resource)
}

function retrieveResources(uri, callback, observe) {
	reqOptions.path = "/api/oic" + uri;
	if (observe) {
		reqOptions.path += "&obs=1";
	}
	var json = "";
	resourceCallback = function(res) {
		res.on('data', function(data) {
			if (observe) {
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
