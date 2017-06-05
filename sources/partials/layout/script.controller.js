(function () {

  angular
    .module("app.layout")
    .controller("LayoutController", LayoutController);

  LayoutController.$inject = ["$scope", "$rootScope", "layoutService", "$uibModal", "FileUploader", "URL", "$state", "verify"];

  function LayoutController($scope, $rootScope, layoutService, $uibModal, FileUploader, URL, $state, verify) {
    var vm = this;
    activate();

    function activate() {
      //  $(window).on('beforeunload', function () {//区别在于onbeforeunload在onunload之前执行，它还可以阻止onunload的执行
      //    vm.user.loginout();
      // });
      // monkey patch for AdminLTE
      $scope.$on('$stateChangeSuccess',
        function (event, toState, toParams, fromState, fromParams) {
          $.AdminLTE.layout.fix();
          // $.AdminLTE.layout.fixSidebar();
          // $.AdminLTE.layout.activate();
        }
      );
      //当模板开始解析之前触发
      $scope.$on('$stateChangeStart',
        function (event, toState, toParams, fromState, fromParams) {
          clearInterval(localStorage.getItem("init"))
        }
      );
    };

    vm.uploader = new FileUploader({
      url: URL.ocr + "/api/ocr_rec",
      method: "POST",
      withCredentials: true,
      queueLimit: 100,
      filters: [{
        name: 'memory',
        // A user-defined filter
        fn: function (item) {
          if ((item.size / 1024 / 1024).toFixed(0) < 4) {
            return true;
          } else {
            layer.msg("操作失败，单个文件大小不超过4MB!")
            return false;
          }
        }
      }, {
        name: 'picture',
        // A user-defined filter
        fn: function (item) {
          var type = "image/jpg,image/gif, image/jpeg,image/png";
          if (type.indexOf(item.type) > -1) {
            return true;
          } else {
            layer.msg("操作失败，只能上传图片，图片格式为jpg、gif、jpeg、png")
            return false;
          }
        }
      }],
      onSuccessItem: function (item, response, status, headers) {
        console.log(item, response, status, headers)
        vm.ocr.result = response.result.res;
      },
      onErrorItem: function (item, response, status, headers) {
        layer.msg(response.head.message);
      }
    });

    vm.ocr = {
      result: "",
      propover: {
        templateUrl: './partials/layout/view.popover.ocr.html',
        placement: "bottom-left"
      },
      actived: true,
      active: function () {
        this.actived = !this.actived;
      }
    }

    vm.calculator = {
      result: "",
      propover: {
        templateUrl: './partials/layout/view.popover.calculator.html',
        placement: "bottom-left"
      },
      i: function ($event) {
        if ($event.keyCode === 13) {
          this.result = this.calcVal(this.result);
        }
        var str = $("#inputNumber").val();
        $("#inputNumber").val(str.replace(/[a-zA-Z]/g, ""));
      },
      input: function (inpChart) {
        if (inpChart == '0' && !this.result) {
          this.result = "";
        } else if (inpChart == '+' || inpChart == '-' || inpChart == '*' || inpChart == '/' || inpChart == '.') {
          if (!this.result) {
            this.result = "0" + inpChart;
          } else if (/[\+\-\*/]$/.test(this.result)) {
            this.result = this.result.slice(0, this.result.length - 1) + inpChart;
          } else {
            this.result = this.result + inpChart;
          }
        } else if (inpChart == '=') {
          if(/[\+\-\*/]/.test(this.result)){
            this.result = this.calcVal(this.result);
          }
        } else {
          this.result = this.result + inpChart;
        }
      },
      calcVal: function (result) {
        if (/[^0-9\+\-\*/\.]$/.test(result)||/[\+\-\*/\.]$/.test(result)) {
          layer.msg("输入有误,请重新输入");
          this.result = "";
          $("#inputNumber").focus();
          return this.result
        } else {
          return eval(result).toFixed(2);
        }
      },
      clearVal: function () {
        this.result = "";
      }
    }

    vm.search = {
      modal: {},
      info: {
        keyword: "",
        type: "null"
      }, //搜索的参数{keyword: "cvbx", type: "cause"}
      openModal: function () {
        this.modal = $uibModal.open({
          templateUrl: "./partials/layout/view.searchWriter.html",
          size: "lg",
          scope: $scope,
          keyboard: false,
          backdrop: 'static',
          windowClass: "modal-searchWriter modal-default",
        });
      },
      searchWriter: function ($event, param, flag) {
        if (($event.keyCode === 13 && (param.keyword != "")) || flag) {
          console.log(param)
          layoutService.writer.searchWriter(param)
            .then(function (data) {
              console.log(data);
              if (verify(data, 200)) {
                if (data.body.length > 0) {
                  if (param.type == "null" && (data.body[0].law.length || data.body[0].cause.length || data.body[0].judgment.length)) {
                    vm.search.type = 1;
                    for (var i in data.body[0].law) {
                      data.body[0].law[i].article_content = data.body[0].law[i].article_content.replace(/\n/g, "<br/>");
                    }
                    vm.search.law = data.body[0].law;
                    vm.search.cause = data.body[0].cause;
                    vm.search.judgment = data.body[0].judgment;
                    vm.search.openModal();
                  } else if (param.type == "law") {
                    vm.search.type = 1;
                    for (var i in data.body) {
                      data.body[i].article_content = data.body[i].article_content.replace(/\n/g, "<br/>");
                    }
                    vm.search.law = data.body;
                    vm.search.cause = [];
                    vm.search.judgment = [];
                    console.log(vm.search.law)
                    vm.search.openModal();
                  } else if (param.type == "cause") {
                    vm.search.type = 2;
                    vm.search.law = [];
                    vm.search.cause = data.body;
                    vm.search.judgment = [];
                    vm.search.openModal();
                  } else if (param.type == "judgment") {
                    vm.search.type = 3;
                    vm.search.law = [];
                    vm.search.cause = [];
                    vm.search.judgment = data.body;
                    vm.search.openModal();

                  } else {
                    layer.msg("没有找到你要搜索的内容", {
                      time: 2000,
                      icon: 5
                    });
                  }
                } else {
                  layer.msg("没有找到你要搜索的内容", {
                    time: 2000,
                    icon: 5
                  });
                }
              } else if (verify(data, 201)) {
                layer.msg(data.head.message, {
                  time: 2000,
                  icon: 5
                });
              }
            })
        }

      },
      getDetails: function (rowkey) {
        this.modal.close();
        $state.go("details", {
          row_key: rowkey
        })
      },
      //关闭模态框
      closeModal: function () {
        this.modal.close();
      },
    }

    //当前用户修改密码
    vm.user = {
      owner: sessionStorage.getItem('username'),
      modal: {},
      userPassword: {},
      openModal: function () {
        this.modal = $uibModal.open({
          templateUrl: "./partials/layout/view.updatePassword.html",
          size: "md",
          scope: $scope,
          keyboard: false,
          backdrop: 'static',
          windowClass: "modal-updatePassword modal-default",
        });
      },
      //修改密码
      updatePassword: function (valid, user) {
        console.log(valid, {
          oldPassword: hex_md5(user.oldPassword).toUpperCase(),
          password: hex_md5(user.password).toUpperCase(),
          rePassword: hex_md5(user.rePassword).toUpperCase(),
        })
        if (valid) {
          layoutService.user.updatePassword({
              oldPassword: hex_md5(user.oldPassword),
              password: hex_md5(user.password),
              rePassword: hex_md5(user.rePassword)
            })
            .then(function (data) {
              if (verify(data, 200)) {
                layer.msg(data.head.message, {
                  time: 2000,
                  icon: 6
                });
                vm.user.userPassword = {};
                vm.user.modal.close();
                $state.go("login");
              } else if (verify(data, 201)) {
                layer.msg(data.head.message, {
                  time: 2000,
                  icon: 5
                });
              }
            })
        }
      },
      loginout: function () {
        layoutService.user.loginout()
          .then(function (data) {
            switch (data.head.status) {
              case 200:
                {
                  layer.msg(data.head.message, {
                    time: 2000,
                    icon: 6
                  })
                  sessionStorage.clear();
                  $state.go("login");
                }
                break;
              default:
                layer.msg(data.head.message, {
                  time: 2000,
                  icon: 5
                })
                break;
            }
          })
      },
      //关闭模态框
      closeModal: function () {
        this.modal.close();
      },
    };
    //反馈信息
    vm.feedback = {
      modal: {},
      info: {
        que_page_url: "",
        que_function: "",
        feedback_info: ""
      },
      openModal: function () {
        this.modal = $uibModal.open({
          templateUrl: "./partials/layout/view.feedback.html",
          size: "md",
          scope: $scope,
          keyboard: false,
          backdrop: 'static',
          windowClass: "modal-feedback modal-default",
        });
      },
      savefeedback: function (valid, info) {
        console.log(valid, info)
        if (valid) {
          var queue = vm.feedback.uploader.queue;
          var que_imge_url = [];
          for (var i in queue) {
            que_imge_url.push(queue[i]._file.name);
          }
          console.log(que_imge_url)
          layoutService.user.feedBack({
              que_page_url: vm.feedback.info.que_page_url,
              que_function: vm.feedback.info.que_function,
              feedback_info: vm.feedback.info.feedback_info,
              que_imge_url: JSON.stringify(que_imge_url)
            })
            .then(function (data) {
              if (verify(data, 200)) {
                layer.msg(data.head.message, {
                  time: 2000,
                  icon: 6
                });
                vm.feedback.info = {};
                vm.feedback.modal.close();
              } else {
                layer.msg(data.head.message, {
                  time: 2000,
                  icon: 5
                });
              }
            })
        }
      },
      //关闭模态框
      closeModal: function () {
        this.modal.close();
      },
      uploader: new FileUploader({
        url: URL.master + "/feedback/store",
        method: "POST",
        withCredentials: true,
        queueLimit: 100,
        headers: {
          "Authorization": "Wiserv " + sessionStorage.token
        },
        autoUpload: true,
        filters: [{
          name: 'picture',
          // A user-defined filter
          fn: function (item) {
            var type = "image/jpg,image/gif, image/jpeg,image/png";
            if (type.indexOf(item.type) > -1) {
              return true;
            } else {
              layer.msg("操作失败，只能上传图片，图片格式为jpg、gif、jpeg、png")
              return false;
            }
          }
        }],
        queueLimit: 100,
        onSuccessItem: function (item, response, status, headers) {
          layer.msg(response.head.message, {
            time: 2000,
            icon: 6
          });
        },
        onErrorItem: function (item, response, status, headers) {
          layer.msg(response.head.message);
        }
      })
    };

  };


})();