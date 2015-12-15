uuid = require('uuid');

exports.parseRes = function(payload) {
  console.log(payload);

  var resource = payload.resource;
  var o = {}; // resource object according to the OIC core spec.
  var link = {};
  var links = [];

  if (typeof resource.id.deviceId != "undefined")
    o.di = resource.id.deviceId;

  if (typeof resource.id.path != "undefined")
    link.href = resource.id.path;

  // TODO: collect all ...
  if (typeof resource.resourceTypes[0] != "undefined")
    link.rt = resource.resourceTypes[0];

  if (typeof resource.interfaces[0] != "undefined")
    link.if = resource.interfaces[0];

  links.push(link);
  o.links = links;

  console.log(JSON.stringify(o));

  return o;
}

exports.parseDevice = function(payload) {
  console.log(payload);

  var device = payload.device;
  var o = {};

  if (typeof device.uuid != "undefined")
    o.di = device.uuid;

  if (typeof device.name != "undefined")
    o.n = device.name;

  if (typeof device.coreSpecVersion != "undefined")
    o.icv = device.coreSpecVersion;

  if (typeof device.dataModelVersion != "undefined")
    o.dmv = device.dataModelVersion;

  console.log(JSON.stringify(o));

  return o;
}

exports.parseP = function(payload) {
  var o = {};

  console.log(payload);
  var info = payload.info;

  if (typeof info.platformID != "undefined")
    o.pi = info.platformID;

  if (typeof info.manufacturerName != "undefined")
    o.mnmn = info.manufacturerName;

  if (typeof info.manufacturerUrl != "undefined")
    o.mnml = info.manufacturerUrl;

  if (typeof info.modelNumber != "undefined")
    o.mnmo = info.modelNumber;

  if (typeof info.dateOfManufacture != "undefined")
    o.mndt = info.dateOfManufacture;

  if (typeof info.platformVersion != "undefined")
    o.mnpv = info.platformVersion;

  if (typeof info.operatingSystemVersion != "undefined")
    o.mnos = info.operatingSystemVersion;

  if (typeof info.hardwareVersion != "undefined")
    o.mnhw = info.hardwareVersion;

  if (typeof info.firmwareVersion != "undefined")
    o.mnfv = info.firmwareVersion;

  if (typeof info.supportUrl != "undefined")
    o.mnsl = info.supportUrl;

  if (typeof info.systemTime != "undefined")
    o.st = info.systemTime;

  var json = JSON.stringify(o);
  console.log(json);

  return json;
}

exports.parseIP = function(addr) {
  var result = "";
  for (var i=0; i < addr.length && addr[i] != 0; i++)
    result += String.fromCharCode(addr[i]);
  return result;
}

exports.parseResource = function(payload) {
  var o = {};

  console.log(payload);

  if (typeof payload.uri != "undefined")
    o.href = payload.uri;

  if (typeof payload.properties != "undefined")
    o.properties = payload.properties;

  var json = JSON.stringify(o);

  if (typeof payload != "undefined")
    console.log(json);

  return json;
}
