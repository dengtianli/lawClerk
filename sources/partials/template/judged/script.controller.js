(function () {
  angular
    .module("app.template.judged")
    .controller("JudgedController", JudgedController);

  JudgedController.$inject = ["judgedService","verify"];

  function JudgedController(judgedService,verify) {
    var vm = this;
    // Template
    vm.template = {
      searchParam: {
        category: "民事案件",
        doc_type: "民事判决书",
        write_type: "normal",
        hearing_procedure: "normal",
        case_brief: "民间借贷纠纷"
      },
      getTemplate: function () {
          console.log(vm.template.searchParam)
          vm.promise =judgedService.getTemplate({
              category: vm.template.searchParam.category,
              doc_type: vm.template.searchParam.doc_type,
              write_type: vm.template.searchParam.write_type,
              hearing_procedure: vm.template.searchParam.hearing_procedure,
              case_brief: vm.template.searchParam.case_brief,
              owner: sessionStorage.getItem("username")
            })
            .then(function (data) {
              if(verify(data,200)){
              console.log( data.body)
              vm.template.info =data.body[0];
              vm.template.name = data.body[0].template_name;
              vm.template.article = JSON.parse(data.body[0].template_article);
              console.log(vm.template.name,vm.template.article )
              }else{
                layer.msg(data.head.message,{time:2000,icon:5})
              }
            })
      },
      saveTemple: function(param){
        param.owner = sessionStorage.getItem("username")
        param.template_article =JSON.stringify(vm.template.article)
        console.log(param)
        judgedService.saveTemplate(param)
            .then(function (data) {
              console.log( data)
              layer.msg(data.head.message)
        })
      }
    }
    activate();

    function activate() {
      vm.template.getTemplate();
    };
  };

})();