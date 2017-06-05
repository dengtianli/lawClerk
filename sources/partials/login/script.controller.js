(function () {

  angular
    .module("app.login")
    .controller("LoginController", LoginController);

  LoginController.$inject = ["loginService", "$state", "verify", "$uibModal", "$scope"];

  function LoginController(loginService, $state, verify, $uibModal, $scope) {
    var vm = this;

    // Init
    function activate() {
      if (sessionStorage.token) {
        sessionStorage.removeItem("token");
      }
      $(".rember-me").iCheck({
        checkboxClass: "icheckbox_square-red hover",
      });
      if ($.cookie("rmbUser") == "true") {
        $("#ck_rmbUser").iCheck('check');
        vm.username=$.cookie("username");
        vm.password=$.cookie("password");
      }
    };

    vm.downloadTools = {
      modal: {},
      open: function(){
        this.modal = $uibModal.open({
          templateUrl: "./partials/login/view.download.html",
          size: "lg",
          keyboard: true,
          scope: $scope,
          backdrop: 'static',
          windowClass: "modal-download-tool modal-default",
        });
      },
      close: function(){
        this.modal.close();
      }
    }

    // auth
    vm.auth = function (valid) {
      if(valid){
        if ($("#ck_rmbUser").parent().hasClass("checked")) {
          var str_username = vm.username;
          var str_password = vm.password;
          $.cookie("rmbUser", "true", { expires: 7 }); //存储一个带7天期限的cookie
          $.cookie("username", str_username, { expires: 7 });
          $.cookie("password", str_password, { expires: 7 });
        }
        else {
          $.cookie("rmbUser", "false", { expire: -1 });
          $.cookie("username", "", { expires: -1 });
          $.cookie("password", "", { expires: -1 });
        }
        loginService.auth({
            loginName: vm.username,
            password: hex_md5(vm.password)
          })
          .then(function (result) {
            if (result && result.data) {
              var data = result.data;
              switch (data.head.status) {
                case 200:
                  {
                    sessionStorage.setItem("username", data.body[0].loginName);
                    sessionStorage.setItem("token", data.head.token);
                    $state.go("cases");
                  }
                  break;
                default:
                  {
                    layer.msg(data.head.message,{time:2000,icon:5});
                  }
                  break;
              }
            }
          })
        }
    }

    activate();
  };

})();