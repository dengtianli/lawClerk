(function () {

  angular
    .module("app.repository.writ.profile")
    .controller("WritProfileController", WritProfileController);

  WritProfileController.$inject = ["writProfileService", "$state", "$stateParams", "uibDateParser"];

  function WritProfileController(writProfileService, $state, $stateParams, uibDateParser) {
    var vm = this;
    vm.Paging = {};
    vm.Paging.currentPage = 1;
    vm.Paging.maxSize = 5;
    vm.Paging.itemsPerPage = 5;

    vm.Paging.pageChanged = function () {
      vm.search(true);
    }
    var getByCategory = function (param) {
      var p = {
        pageSize: vm.Paging.itemsPerPage,
        current: vm.Paging.currentPage,
        court_place: $stateParams.court_place,
        court_level: $stateParams.court_level,
        case_brief: $stateParams.case_brief,
        doc_type: $stateParams.doc_type,
        keyword: $stateParams.keyword
      }
      if (param) {
        p = _.assign({}, p, param);
      }
      console.log(p)
      writProfileService.getByCategory(p).then(function (results) {
        console.log(results)
        vm.data = results.data.body;
        vm.total = results.data.head.total;
        vm.Paging.totalItems = results.data.head.total;
        vm.totalPage = Math.ceil(vm.Paging.totalItems / vm.Paging.itemsPerPage)
      })
    }

    vm.getDetails = function (rowkey) {
      $state.go("details", {
        row_key: rowkey
      })
    }
    vm.prev = function () {
      history.back(-1)
    }
    vm.inquire = function (valid) {
      if (vm.keyword && valid) {
        $state.go("extend", {
          type: 'judgment',
          keyword: vm.keyword
        });
      } else {
        layer.msg("请正确输入您要查询的关键字");
      }
    }
    vm.search = function (valid) {
        if (valid) {
          var startTime = null;
          var endTime = null;
          if (vm.writSelectVal.judge_date_start) {
            startTime = moment(vm.writSelectVal.judge_date_start, true).format("YYYY-MM-DD"); //开始时间
          }
          if (vm.writSelectVal.judge_date_end) {
            endTime = moment(vm.writSelectVal.judge_date_end, true).format("YYYY-MM-DD"); //结束时间
          }
          getByCategory({
            judge_date_start: startTime,
            judge_date_end: endTime
          });
        } 
      }
      //转换成日期插件需要的日期格式：sting to object
    vm.writSelectVal = $stateParams
    console.log($stateParams)
    var startTime = vm.writSelectVal.judge_date_start;
    var endTime = vm.writSelectVal.judge_date_end;
    if (vm.writSelectVal.judge_date_start) {
      vm.writSelectVal.judge_date_start = uibDateParser.parse(vm.writSelectVal.judge_date_start, "yyyy-MM-dd", vm.writSelectVal.judge_date_start)
    }
    if (vm.writSelectVal.judge_date_end) {
      vm.writSelectVal.judge_date_end = uibDateParser.parse(vm.writSelectVal.judge_date_end, "yyyy-MM-dd", vm.writSelectVal.judge_date_end)
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
    vm.changeDate = function () {
      var startTime = vm.writSelectVal.judge_date_start;
      vm.writSelectVal.judge_date_end="";
      console.log(startTime)
      vm.date.dateOptions2 = {
        format: 'yyyy-MM-dd',
        maxDate: new Date(),
        minDate: startTime,
        startingDay: 1,
      }
    }
    vm.open1 = function () {
        vm.date.popup1.opened = true;
      } //日期插件参数
    vm.open2 = function () {
        vm.date.popup2.opened = true;
      } //日期插件参数

    activate({
      judge_date_start: startTime,
      judge_date_end: endTime
    });

    function activate(param) {
      getByCategory(param);
    };
  };

})();