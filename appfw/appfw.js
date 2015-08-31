exports.parseRes = function(id, status, msg, apps) {
  if (status == 0) {
    var result = [];
    for (var i = 0; i < apps.length; i++) {
      result.push(apps[i].appid);
    }
    var json = JSON.stringify(result);
  } else {
    var json = {"error":{"code": 500,"message":"Failed to query application list request."}}
  }

  return json;
}
