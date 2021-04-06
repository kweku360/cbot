StdResponse = function (status, payload, message = "") {
  var res = { status, payload, message };
  return res;
};

module.exports = StdResponse;
