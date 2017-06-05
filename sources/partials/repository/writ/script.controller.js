(function () {
  angular
    .module("app.repository.writ")
    .controller("WritController", WritController);

  WritController.$inject = ["$scope", "$state", "writService", "$stateParams"];

  function WritController($scope, $state, writService, $stateParams) {
    var vm = this;
    vm.total = $stateParams.total;

    //下拉框默认值(法律类别/时效性)
    vm.writSelectVal = {
      // 'court_level':'高级人民法院',
      // 'doc_type':'民事裁判书',
      // 'case_brief':'合同纠纷'
    };

    vm.prev = function () {
      $state.go("repository.law");
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
    }
    vm.changeDate = function () {
      var startTime = vm.writSelectVal.judge_date_start;
      vm.writSelectVal.judge_date_end ='';
      console.log(startTime)
      vm.date.dateOptions2 = {
        format: 'yyyy-MM-dd',
        maxDate: new Date(),
        minDate: startTime,
        startingDay: 1,
      }
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
        });
        var startTime = null;
        var endTime = null;
        if (vm.writSelectVal.judge_date_start) {
          startTime = moment(vm.writSelectVal.judge_date_start, true).format("YYYY-MM-DD"); //开始时间
        }
        if (vm.writSelectVal.judge_date_end) {
          endTime = moment(vm.writSelectVal.judge_date_end, true).format("YYYY-MM-DD"); //结束时间
        }
        $state.go("profile", {
          court_place: vm.territory,
          court_level: vm.writSelectVal.court_level,
          case_brief: vm.writSelectVal.case_brief,
          doc_type: vm.writSelectVal.doc_type,
          keyword: vm.point,
          judge_date_start: startTime,
          judge_date_end: endTime
        });
      }else{
        layer.msg("请正确输入您要查询的关键字");
      }
    }


    activate();

    function activate() {};
  };

})();