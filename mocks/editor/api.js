const Router = require("express").Router(),
      Util = require("../common/util.js");
      _ = require("lodash");

// http://192.168.13.77:8080/CourtDecisionSystem/verdict/template
Router.route("/verdict/template")
  .get(function(request, response) {
    response.json(Util.json("/editor/data/verdict-template.json"));
});

// http://192.168.13.77:8080/CourtDecisionSystem/conditon/tree
Router.route("/conditon/tree")
  .get(function(request, response) {
    response.json(Util.json("/editor/data/conditon-tree.json"));
});

// http://192.168.13.77:8080/CourtDecisionSystem/conditon/tree/info?owner=&tree_id=20
Router.route("/conditon/tree/info")
  .get(function(request, response) {
    response.json(Util.json("/editor/data/conditon-tree-info.json"));
});

// http://192.168.13.77:8080/CourtDecisionSystem/case/main
Router.route("/case/main")
  .get(function(request, response) {
    response.json(Util.json("/editor/data/case-main.json"));
});

// http://192.168.13.77:8080/CourtDecisionSystem/case/main/info?owner=&tree_id=238
Router.route("/case/main/info")
  .get(function(request, response) {
    response.json(Util.json("/editor/data/case-main-info.json"));
});


module.exports = Router;
