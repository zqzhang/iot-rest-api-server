var app_fw = require('iot/iot-appfw');
var child_process = require('child_process');

var launcher = "iot-launch ";

exports.listApps = function(all, callback) {
  if (all)
    app_fw.ListAllApplications(callback);
  else
    app_fw.ListRunningApplications(callback);
}

exports.startApp = function(appId, args, callback) {
  child_process.exec(launcher + appId, callback);
}

exports.extractAppInfo = function(apps, status, allApps, appId) {
  var result = [];
    for (var i = 0; i < apps.length; i++) {
      var o = {};

      if (typeof apps[i].appid != "undefined")
        o.app = apps[i].appid;

      if (typeof apps[i].description  != "undefined")
        o.description = apps[i].description;

      if (typeof apps[i].desktop != "undefined")
        o.desktop = apps[i].desktop;

      if (typeof apps[i].user != "undefined")
        o.user = apps[i].user;

      if (typeof apps[i].argv != "undefined")
        o.argv = apps[i].argv;

      if (allApps) {
        result.push(o);
      } else if (appId == apps[i].appid) {
        result.push(o);
        break;
      }
  }
  return result;
}
