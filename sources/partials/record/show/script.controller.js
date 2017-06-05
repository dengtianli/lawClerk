(function () {
  /* controller */
  angular
    .module("app.record.show")
    .controller("ShowController", ShowController);

  ShowController.$inject = ["$scope", "$state", "$stateParams", "showService", "verify", "$sce","recordService", "$window"];

  function ShowController($scope, $state, $stateParams, showService, verify, $sce,recordService, $window) {
    var vm = this;
     // Operation
    vm.goToRecord = function(){
      $state.go("record",{},{reload:true})
    }
    vm.operation = {
      export: function () {
        var article = $("#record-content").html().trim();
        console.info(article);
        window.saveAs(htmlDocx.asBlob(article), "庭审笔录" + '.docx');
        $state.go("record");
      },
      print: function() {
        $window.document.body.innerHTML = $("#record-content").html();
            $window.print();
            $window.location.reload();
            $state.go("record");
        // layer.open({
        //   content: '是否作为最终版本？',
        //   yes: function(index, layero) {
            
        //     layer.close(index);
        //   }
        // });
      }
    }

    function isType(data) {
      return Object.prototype.toString.call(data);
    }
    activate();

    function activate() {
      console.log($stateParams.list)
      var _params = JSON.parse($stateParams.list),
        _obj = recordService.getRecordData(_params),
        _content = JSON.parse(_obj.record_content),
        _array = [];
      console.log(_obj.record_content)
      vm.court_name = _obj.court_name
      dataConversion(_content)
      function dataConversion(array) {
        array.forEach(function(item){
          _array.push({
            id:item.id,
            value:item.content.replace(/\n/g, "<br/>")
          });
          if('child' in item && item.child.length){
            dataConversion(item.child);
          }
        });
        vm.info = _array;
      }
    }
  }
})();