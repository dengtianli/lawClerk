const Router = require("express").Router(),
      Util = require("../common/util.js");
      _ = require("lodash");

Router.route("/login")
  .post(function(request, response) {
    response.json(Util.json("/login/data/success.json"));
});

module.exports = Router;
