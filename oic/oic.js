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
  var result = [];
  var json = JSON.stringify(result);
  return json;
}

exports.parseP = function(payload) {
  var result = [];
  var json = JSON.stringify(result);
  return json;
}
