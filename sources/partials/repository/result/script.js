(function () {
  angular
    .module("app.repository.law.result")
    .controller("ResultController", ResultController);

  ResultController.$inject = ["$scope", "$state", "resultService", "$stateParams", "uibDateParser"];

  function ResultController($scope, $state, resultService, $stateParams, uibDateParser) {
    var vm = this;

    vm.Paging = {};
    vm.Paging.currentPage = 1;
    vm.Paging.maxSize = 5;
    vm.Paging.itemsPerPage = 5;

    vm.Paging.pageChanged = function () {
      vm.search(true);
    }
    vm.prev = function () {
      history.back(-1)
    }
    vm.search = function (valid) {
      if (valid) {
        var startTime = null;
        var endTime = null;
        if (vm.law.publish_date_start) {
          startTime = moment(vm.law.publish_date_start, true).format("YYYY-MM-DD"); //开始时间
        }
        if (vm.law.publish_date_end) {
          endTime = moment(vm.law.publish_date_end, true).format("YYYY-MM-DD"); //结束时间
        }
        findByAccurate({
          publish_date_start: startTime,
          publish_date_end: endTime
        })
      }
    }
    var findByAccurate = function (param) {
      var p = {
        title: vm.law.title,
        effective: vm.law.effective,
        category_name: vm.law.category_name,
        publish_department: vm.law.publish_department,
        pageSize: vm.Paging.itemsPerPage,
        current: vm.Paging.currentPage
      }
      if (param) {
        p = _.assign({}, p, param);
      }
      console.log(p)
      resultService.findByAccurate(p).then(function (results) {
        vm.data = results.data.body;
        vm.total = results.data.head.total;
        vm.Paging.totalItems = results.data.head.total;
        vm.totalPage = Math.ceil(vm.Paging.totalItems / vm.Paging.itemsPerPage)
      })
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
      //转换成日期插件需要的日期格式：sting to object
    vm.law = $stateParams
    console.log($stateParams)
    var startTime = vm.law.publish_date_start;
    var endTime = vm.law.publish_date_end;
    if (vm.law.publish_date_start) {
      vm.law.publish_date_start = uibDateParser.parse(vm.law.publish_date_start, "yyyy-MM-dd", vm.law.publish_date_start)
    }
    if (vm.law.publish_date_end) {
      vm.law.publish_date_end = uibDateParser.parse(vm.law.publish_date_end, "yyyy-MM-dd", vm.law.publish_date_end)
    }
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
      var startTime = vm.law.publish_date_start;
      vm.law.publish_date_end ="";
      console.log(startTime)
      vm.date.dateOptions2 = {
        format: 'yyyy-MM-dd',
        maxDate: new Date(),
        minDate: startTime,
        startingDay: 1,
      }
    }

    activate({
      publish_date_start: startTime,
      publish_date_end: endTime
    });

    function activate(param) {
      findByAccurate(param)
    };



  };

})();