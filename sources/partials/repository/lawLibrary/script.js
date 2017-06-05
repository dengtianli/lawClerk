(function () {
  /* module */
  angular.module("app.repository.law.lawLibrary", ["app.repository.law.result"]);

  /* router */

  angular
    .module('app.repository.law.lawLibrary')
    .config(lawRouter);

  lawRouter.$inject = ["$stateProvider"];

  function lawRouter($stateProvider) {
    $stateProvider
      .state("result", {
        parent: "repository",
        url: "/law/lawLibrary/result/:title/:effective/:category_name/:publish_department/:publish_date_start/:publish_date_end",
        templateUrl: "partials/repository/result/view.html",
        controller: "ResultController",
        controllerAs: "Result",
      })
  }

  /* controller */
  angular
    .module("app.repository.law.lawLibrary")
    .controller("LawLibraryController", LawLibraryController);

  LawLibraryController.$inject = ["lawLibraryService", "$scope", "$state", "$stateParams", "uibDateParser"];

  function LawLibraryController(lawLibraryService, $scope, $state, $stateParams, uibDateParser) {
    var vm = this;
    //下拉框默认值(法律类别/时效性)
    vm.lawSelectVal = {
      category_name: "民法商法",
      effective: "有效"
    };
    $scope.changervar = function (val, key) {
      vm.lawSelectVal[key] = val; //点击关闭按钮获取下拉菜单的值
    }


    vm.total = $stateParams.total;
    vm.search = function () {
      $(".box").css({
        "display": "block"
      });
      $(".tips").css({
        "display": "none"
      });
      $(".summary").css({
        "display": "none"
      })
    }
    vm.cancel = function (valid) {
      if (valid) {
        $(".box").css({
          "display": "none"
        });
        $(".tips").css({
          "display": "block"
        });
        $(".summary").css({
          "display": "flex"
        })
        var startTime = null;
        var endTime = null;
        if (vm.lawSelectVal.publish_date_start) {
          startTime = moment(vm.lawSelectVal.publish_date_start, true).format("YYYY-MM-DD"); //开始时间
        }
        if (vm.lawSelectVal.publish_date_end) {
          endTime = moment(vm.lawSelectVal.publish_date_end, true).format("YYYY-MM-DD"); //结束时间
        }
        $state.go("result", {
          title: vm.title,
          effective: vm.lawSelectVal.effective,
          category_name: vm.lawSelectVal.category_name,
          publish_department: vm.publish_department,
          publish_date_start: startTime,
          publish_date_end: endTime
        })
      }else {
        layer.msg("请正确输入您要查询的关键字");
      }
    }
    vm.inquire = function (valid) {
      if (vm.keyword && valid) {
        $state.go("extend", {
          type: 'law',
          keyword: vm.keyword
        });
      } else {
        layer.msg("请正确输入您要查询的关键字");
      }
    }
    vm.prev = function () {
        history.back(-1)
      }
      //时间参数配置
    vm.date = {};
    vm.date.dateOptions1 = {
        format: 'yyyy-MM-dd',
        maxDate: new Date(),
        minDate: new Date(1900),
        startingDay: 1,
      } //日期插件参数
    vm.date.dateOptions2 = {
      format: 'yyyy-MM-dd',
      maxDate: new Date(),
      startingDay: 1,
    }
    vm.date.popup1 = {
        opened: false
      } //日期插件参数
    vm.date.popup2 = {
        opened: false
      } //日期插件参数
    vm.open1 = function () {
        vm.date.popup1.opened = true;
      } //日期插件参数
    vm.open2 = function () {
        vm.date.popup2.opened = true;
      } //日期插件参数
    vm.changeDate = function () {
      var startTime = vm.lawSelectVal.publish_date_start;
      vm.lawSelectVal.publish_date_end ='';
      console.log(startTime)
      vm.date.dateOptions2 = {
        format: 'yyyy-MM-dd',
        maxDate: new Date(),
        minDate: startTime,
        startingDay: 1,
      }
    }
    activate();

    function activate() {

    };
  };

  /* service */
  angular
    .module("app.repository.law.lawLibrary")
    .service("lawLibraryService", lawLibraryService);

  lawLibraryService.$inject = ["$http"];

  function lawLibraryService($http) {
    var service = {
      test: test
    };
    return service;

    function test() {};
  };

})();