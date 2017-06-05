(function () {
  /* module */
  angular.module("app.repository.cause.content", []);

  /* controller */
  angular
    .module("app.repository.cause.content")
    .controller("CauseResultController", CauseResultController);

  CauseResultController.$inject = ["$scope", "$state", "causeResultService", "$stateParams", "$sce"];

  function CauseResultController($scope, $state, causeResultService, $stateParams, $sce) {
    var vm = this;

    vm.Paging = {};
    vm.Paging.currentPage = 1;
    vm.Paging.maxSize = 5;
    vm.Paging.itemsPerPage = 5;

    vm.Paging.pageChanged = function () {
      findBysort();
    }
     vm.prev = function () {
      history.back(-1)
    }
    vm.inquire = function (valid) {
      if (vm.keyword && valid ) {
        $state.go("extend", {
          type: 'cause',
          keyword: vm.keyword
        });
      } else {
        layer.msg('请正确输入您要查询的关键字')
      }
    }
    var findBysort = function (param) {
      var p = {
        sort: '民事案由',
        pageSize: vm.Paging.maxSize,
        current: vm.Paging.currentPage
      }
      p = _.assign({}, p, param);
      console.log(p)
      causeResultService.findBysort(p).then(function (results) {
        var data = results.data.body;
        console.log(data);
        vm.causeData = data;
        vm.total = results.data.head.total;
        vm.Paging.totalItems = results.data.head.total;
        vm.totalPage = Math.ceil(vm.Paging.totalItems / vm.Paging.itemsPerPage)
        console.log(vm.causeData);
      })
    }
    vm.levelChange = function (part) {
      causeResultService.findByParent({
        case_brief: part,
        type: "level_2"
      }).then(function (results) {
        vm.level_2 = results.data.body;
        vm.case_district = results.data.body[0].case_district;
        vm.levelChildChange(vm.case_district);
      })
    }
    vm.levelChildChange = function (part) {
      causeResultService.findByParent({
        case_brief: part,
        type: "level_3"
      }).then(function (results) {
        vm.level_3 = results.data.body;
        vm.case_cause = results.data.body[0].case_cause;
      })
    }

    var findByParent = function () {
      causeResultService.findByParent({
        case_brief: '民事案由',
        type: 'level_1'
      }).then(function (results) {
        vm.level_1 = results.data.body;
        vm.case_part = $stateParams.case_part;
        console.log(vm.case_part)
        vm.levelChange(vm.case_part);
      })
    }
    vm.search = function () {
      var param = {
        case_part: vm.case_part,
        case_district: vm.case_district,
        case_cause: vm.case_cause,
      }
      findBysort(param);
    }
    activate();

    function activate() {
      var param = {
        case_part: $stateParams.case_part,
        case_district: $stateParams.case_district,
        case_cause: $stateParams.case_cause,
      }
      findBysort(param);
      findByParent();
    };
  };

  /* service */
  angular
    .module("app.repository.cause.content")
    .service("causeResultService", causeResultService);

  causeResultService.$inject = ["$http", "URL"];

  function causeResultService($http, URL) {
    var path = URL.master;
    var service = {
      findBysort: findBysort,
      findByParent: findByParent
    };
    return service;

    function findBysort(params) {
      return $http.post(
        path + '/case_brief/find/list', params
      )
    };

    function findByParent(params) {
      return $http({
          method: "GET",
          url: path + "/case_brief/find/byParent",
          params: params
        })
        .catch(function (error) {
          console.info(error);
        })
    }
  }

})();