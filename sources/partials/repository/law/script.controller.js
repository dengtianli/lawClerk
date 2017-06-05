(function () {
  /* controller */
  angular
    .module("app.repository.law")
    .controller("LawController", LawController);

  LawController.$inject = ["$scope", "$rootScope", "$state", "lawService", "verify", 'repositoryService'];

  function LawController($scope, $rootScope, $state, lawService, verify, repositoryService) {
    var vm = this,
      bgDOM = $('#repository-law .law-wrap');
    vm.resultShow = false;
    // filter
    vm.filterBy = filterBy;
    // input keydown
    vm.keydown = keydown;
    // go to search result
    vm.search = search;
    //// write input back
    vm.writeback = writeback;

    //init loading
    var initRequest = {
      searchAll: function () {
        lawService.searchAll().then(function (results) {
          vm.data = results.data.body[0];
        })
      },
      getToday: function () {
        lawService.getToday().then(function (results) {
          vm.today = results.data.body[0];
        })
      }
    }

    function filterBy() {
      selected_index = -1;
      vm.resultShow = true;
      lawService.filterBy({
        keyword: vm.keyword
      }).then(function (results) {
        vm.suggest = results.data.body;
      });
    }
    var selected_index = -1; // keydown event selceted index
    function keydown(ev, valid) {
      if (valid) {
        ev.stopPropagation();
        ev = window.event || ev;
        var keycode = ev.keyCode;
        var list_length = $('.suggest-result').find('li').length;
        if (keycode == 13) { // press enter
          search(valid);
        }
        if (keycode == 38) { // press up
          selected_index--;
          if (selected_index == -1 || selected_index == -2) {
            selected_index = list_length - 1;
          }
        } else if (keycode == 40) { // press down
          selected_index++;
          if (selected_index == list_length) {
            selected_index = 0;
          }
        }
        if (selected_index == -1) {
          return;
        }
        var selected_li = $('.suggest-result').find('li').removeClass('active').eq(selected_index);
        selected_li.addClass('active');
        vm.keyword = selected_li.html();
        vm.type = selected_li.attr('data-type');
      }else{
        layer.msg("搜索内容不能超过100个字符!")
      }
    }

    function search(valid) {
      switch (vm.type) {
        case '案由':
          vm.type = 'cause';
          break;
        case '裁判文书':
          vm.type = 'judgment';
          break;
        case '法条':
          vm.type = 'law';
          break;
        default:
          vm.type = null;
          break;
      }
      if (vm.keyword && valid) {
        repositoryService.setType('');
        $state.go("extend", {
          keyword: vm.keyword,
          type: vm.type
        }, {
          reload: true
        });
      } else {
        layer.msg("请正确输入您要查询的关键字")
      }
    }

    function writeback(ev) {
      if (!ev) ev = window.event;
      var target = ev.target || ev.srcElement;
      vm.keyword = target.innerHTML;
      vm.resultShow = false;
      selected_index = -1;
    }

    vm.go = function (flag, data) {
      switch (flag) {
        case 'law':
          repositoryService.setType('law');
          $state.go('lawLibrary', {
            total: data
          });
          break;
        case 'cause':
          repositoryService.setType('cause');
          $state.go('cause', {
            total: data
          });
          break;
        case 'writ':
          repositoryService.setType('writ');
          $state.go('writ', {
            total: data
          });
        default:
          // statements_def
          break;
      }
    }
    activate();

    function activate() {
      var bgDOM = $('#repository-law .law-warp'),
        headerDom = $('#layout .main-header'),
        docClientHeight = document.documentElement.clientHeight,
        headerHeight = headerDom.outerHeight(),
        clientHeight = docClientHeight - headerHeight;
      //设置背景图片全屏显示，没有处理resize
      bgDOM.css('height', clientHeight + 'px');
      initRequest.searchAll();
      initRequest.getToday();
    };
  };

})();