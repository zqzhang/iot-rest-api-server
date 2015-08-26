uuid = require('uuid');

exports.parseRes = function(payload) {
  var result = [];
  var resources = payload.resources;

  console.log(resources);

  for (var i = 0; i < resources.length; i++) {
    var o = {};
    var link = {};
    var links = [];

    if (typeof resources[i].sid != "undefined")
      o.di = uuid.unparse(resources[i].sid);

    if (typeof resources[i].uri != "undefined")
      link.href = resources[i].uri;

    if (typeof resources[i].types[0] != "undefined")
      link.rt = resources[i].types[0];

    if (typeof resources[i].interfaces[0] != "undefined")
      link.if = resources[i].interfaces[0];

    links.push(link);
    o.links = links;
    result.push(o);
  }
  var json = JSON.stringify(result);
  console.log(json);

  return json;
}

exports.parseD = function(payload) {
  var o = {};

  console.log(payload);

  if (typeof payload.sid != "undefined")
    o.di = uuid.unparse(payload.sid);

  if (typeof payload.deviceName != "undefined")
    o.m = payload.deviceName;

  if (typeof payload.specVersion != "undefined")
    o.icv = payload.specVersion;

  if (typeof payload.dataModelVersion != "undefined")
    o.dmv = payload.dataModelVersion;

  var json = JSON.stringify(o);
  console.log(json);

  return json;
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
