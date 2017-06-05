(function () {
  /* module */
  angular.module("app.repository.extend", ["ngSanitize", "app.cases", "app.repository"]);

  /* controller */
  angular
    .module("app.repository.extend")
    .controller("ExtendController", ExtendController);

  ExtendController.$inject = ["$scope", "$state", "$stateParams", "extendService", "$sce", "repositoryService", "verify"];

  function ExtendController($scope, $state, $stateParams, extendService, $sce, repositoryService, verify) {
    var vm = this;
    vm.keyword = $stateParams.keyword;
    vm.type = $stateParams.type;
    vm.prev = function () {
      $state.go("repository.law");
    }
    vm.inquire = function (valid) {
      if (vm.keyword && valid) {
        $state.go("extend", {
          type: vm.type,
          keyword: vm.keyword
        });
      } else {
        layer.msg('请正确输入您要查询的关键字')
      }
    }
    vm.getDetails = function (rowkey) {
      $state.go("details", {
        row_key: rowkey
      })
    }
    vm.initRequest = {
      findAll: function () {
        extendService.findAll({
          type: $stateParams.type,
          keyword: $stateParams.keyword
        }).then(function (results) {
          console.log(results.data);
          var data = results.data;
          if (verify(data, 200)) {
            if (data.body.length > 0) {
              if ($stateParams.type == "" && (data.body[0].law.length || data.body[0].cause.length || data.body[0].judgment.length)) {
                vm.initRequest.type = 1;
                for (var i in data.body[0].law) {
                  data.body[0].law[i].article_content = data.body[0].law[i].article_content.replace(/\n/g, "<br/>");
                }
                vm.initRequest.law = data.body[0].law;
                vm.initRequest.cause = data.body[0].cause;
                vm.initRequest.judgment = data.body[0].judgment;
              } else if ($stateParams.type == "law") {
                vm.initRequest.type = 1;
                for (var i in data.body) {
                  data.body[i].article_content = data.body[i].article_content.replace(/\n/g, "<br/>");
                }
                vm.initRequest.law = data.body;
                vm.initRequest.cause = [];
                vm.initRequest.judgment = [];
              } else if ($stateParams.type == "cause") {
                vm.initRequest.type = 2;
                vm.initRequest.law = [];
                vm.initRequest.cause = data.body;
                vm.initRequest.judgment = [];
              } else if ($stateParams.type == "judgment") {
                vm.initRequest.type = 3;
                vm.initRequest.law = [];
                vm.initRequest.cause = [];
                vm.initRequest.judgment = data.body;
                vm.getDetails = function (rowkey) {
                  $state.go("details", {
                    row_key: rowkey
                  })
                }
              } else {
                $(".content").css({
                  "display": "none"
                })
                layer.msg("没有找到你要搜索的内容", {
                  time: 2000,
                  icon: 5
                });
              }
            } else {
              $(".content").css({
                "display": "none"
              })
              layer.msg("没有找到你要搜索的内容", {
                time: 2000,
                icon: 5
              });
            }
          } else if (verify(data, 201)) {
            $(".content").css({
              "display": "none"
            })
            layer.msg(data.head.message, {
              time: 2000,
              icon: 5
            });
          }
        })
      }
    }

    activate();

    function activate() {
      vm.initRequest.findAll();
    }
  }

  /* service */
  angular
    .module("app.repository.extend")
    .service("extendService", extendService);

  extendService.$inject = ["$http", "URL"];

  function extendService($http, URL) {
    var path = URL.master;
    var service = {
      findAll: findAll
    };
    return service;

    function findAll(params) {
      return $http({
          method: "GET",
          url: path + "/kb/search/find",
          params: params
        })
        .catch(function (error) {
          console.info(error);
        })
    };
  };
})();