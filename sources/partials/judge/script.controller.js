(function () {

  /* controller */
  angular
    .module("app.judge")
    .controller("JudgeController", JudgeController);

  JudgeController.$inject = [
    "$sce",
    "$window",
    "$anchorScroll",
    "serviceMaterial",
    "serviceTreeReason",
    "serviceTreeResult",
    "serviceTemplate",
    "serviceOperation",
    "$stateParams",
    "FileUploader",
    "URL",
    "$uibModal",
    "$scope",
    "uibDateParser",
    "$state",
    "verify"
  ];

  function JudgeController(
    $sce,
    $window,
    $anchorScroll,
    serviceMaterial,
    serviceTreeReason,
    serviceTreeResult,
    serviceTemplate,
    serviceOperation,
    $stateParams,
    FileUploader,
    URL,
    $uibModal,
    $scope,
    uibDateParser,
    $state,
    verify
  ) {
    var vm = this;

    // Init
    function activate() {
      vm.case = $stateParams;
      var operation = vm.case.operation || "UPDATE";
      if (operation === "UPDATE") {
        vm.template.getUpdatedTemplate();
      } else if (operation === "REDO") {
        vm.template.getTemplate();
      }
      $("[name='my-checkbox']").bootstrapSwitch(); //switch开关
      vm.treeReason.getTree();
      vm.treeResult.getTree();
      vm.material.downloader();
      vm.operation.formula.init();
    };

    // Case
    vm.case = {};

    // Template
    vm.template = {
      article: {},
      option: {
        nodeChildren: "nodes",
        dirSelectable: false,
      },
      anchor: function (id) {
        $('#' + id).focus();
        $anchorScroll(id);
      },
      getTemplate: function () {
        //是否直接用localStorage 的article 模板，否则请求后台调取
        var temple = JSON.parse(localStorage.getItem(vm.case.case_no));
        if (vm.case.istemple == 1 && temple) {
          vm.template.article = temple;
          vm.judgments_results = vm.template.article[5].content ; //引用前的 裁判结果 部分内容
          //暂定每隔5秒保存一次
          vm.template.saveTolocalstorage();
        } else {
          vm.article = serviceTemplate.getTemplate({
              case_no: vm.case.case_no,
              category: vm.case.category,
              doc_type: vm.case.doc_type,
              write_type: vm.case.write_type,
              hearing_procedure: vm.case.hearing_procedure,
              case_brief: vm.case.case_brief,
              owner: sessionStorage.getItem("username")
            })
            .then(function (results) {
              vm.template.article = results.body[0].template_article;
              vm.judgments_results = vm.template.article[5].content ; //引用前的 裁判结果 部分内容
                //暂定每隔5秒保存一次
              vm.template.saveTolocalstorage();
              return vm.template.article;
            })
        }
      },
      saveTolocalstorage: function () {
        var init = setInterval(function () {
          //保存当前案号的article 内容
          localStorage.setItem(vm.case.case_no, JSON.stringify(vm.template.article));
        }, 5000)
        localStorage.setItem("init", init);
      },
      getUpdatedTemplate: function () {
        //是否直接用localStorage 的article 模板，否则请求后台调取
        var temple = JSON.parse(localStorage.getItem(vm.case.case_no));
        if (vm.case.istemple == 1 && temple) {
          vm.template.article = temple;
          vm.judgments_results = vm.template.article[5].content ; //引用前的 裁判结果 部分内容
          //暂定每隔5秒保存一次
          vm.template.saveTolocalstorage();
        } else {
          vm.article = serviceTemplate.getUpdatedTemplate({
              case_no: vm.case.case_no
            })
            .then(function (results) {
              vm.template.article = eval("(" + results.body[0].json_content + ")");
              vm.judgments_results = vm.template.article[5].content ; //引用前的 裁判结果 部分内容
              //暂定每隔5秒保存一次
              vm.template.saveTolocalstorage();
              return vm.template.article;
            })
        }
      },
      saveArticle: function () {
        localStorage.article = this.article;
        layer.msg("文书保存成功!");
      },
      uploadArticle: function () {
        var operation = vm.case.operation || "UPDATE";
        if (operation === "REDO") {
          //清除当前案号对应自动保存定时器以及保存的内容
          clearTimeout(localStorage.getItem("init"));
          localStorage.removeItem(vm.case.case_no);
          serviceTemplate.saveArticle({
              // from $stateParams
              case_no: vm.case.case_no,
              template_id: vm.case.template_id,
              category: vm.case.category,
              doc_type: vm.case.doc_type,
              write_type: vm.case.write_type,
              hearing_procedure: vm.case.hearing_procedure,
              creater: sessionStorage.getItem("username"),
              court_name: vm.case.court_name,
              case_brief: vm.case.case_brief,
              accepted_date: vm.case.accepted_date,
              closure_flag: vm.case.closure_flag,
              // from judgment or article
              verdict_content: $("#judgment").parent().html(),
              json_content: JSON.stringify(this.article),
              judge_info: JSON.stringify(vm.template.article[7].nodes[0].content),
              court_clerk: JSON.stringify(vm.template.article[7].nodes[2].content),
              judgment_date: JSON.stringify(vm.template.article[7].nodes[1].content),
              parties_baseinfo: JSON.stringify(vm.template.article[1].nodes[0].content)
            })
            .then(function (results) {
              layer.msg(results.data.head.message);
            })
        } else if (operation === "UPDATE") {
          //清除当前案号对应自动保存定时器以及保存的内容
          clearTimeout(localStorage.getItem("init"));
          localStorage.removeItem(vm.case.case_no);
          var judgment_date = $("#judgment_date").text().replace("年", "-");
          judgment_date = judgment_date.replace("月", "-");
          judgment_date = judgment_date.replace("日", "-");
          if (judgment_date.indexOf(" - - -") > -1||/[^0-9]/.test(judgment_date)) {
            judgment_date = '';
          }
          serviceTemplate.updateArticle({
              case_no: vm.case.case_no,
              judgment_date: judgment_date,
              json_content: JSON.stringify(this.article),
              judge_info: JSON.stringify(vm.template.article[7].nodes[0].content),
              court_clerk: JSON.stringify(vm.template.article[7].nodes[2].content),
              parties_baseinfo: JSON.stringify(vm.template.article[1].nodes[0].content),
              closure_flag: "0"
            })
            .then(function (results) {
              layer.msg(results.head.message);
            })
        }
      }
    };

    // Tree reason
    vm.treeReason = {
      option: {
        nodeChildren: "next_nodes",
        dirSelectable: false,
      },
      treeModel: {},
      treeInfoModel: [],
      defaultTreeModel: {},
      selectedTreeModel: {},
      reasonPartContent: "", //存一、二部分理由部分的内容
      getTree: function () {
        serviceTreeReason.getTree()
          .then(function (result) {
            vm.treeReason.treeModel = result.body;
            vm.treeReason.selectedTreeModel = vm.treeReason.treeModel[3]; //默认的是第四个
            vm.treeReason.the_plea_opinion_plea_opinion_defendant = vm.template.article[2].nodes[0].nodes[1].content;//引用前的事实部分-诉辩意见-被告方诉辩意见内容(二)
            vm.treeReason.proof = vm.template.article[2].nodes[2].content; //自动替换前的事实部分-举证质证内容
            vm.treeReason.proof_fact_proof_authentication = vm.template.article[2].nodes[3].nodes[0].content; //自动替换前的事实部分-证据事实认定-证据认定内容（一、三）
            vm.treeReason.proof_fact_proof_affirm = vm.template.article[2].nodes[3].nodes[1].content; //自动替换前的事实部分-证据事实认定-事实认定内容（一、二）
            vm.treeReason.reason =vm.template.article[3].content; //引用前的理由部分内容
            vm.treeReason.getlevel1TreeInfo();

          })
      },
      // access tree
      expandNodes: [],
      selectedNode: {},
      selectedNodes: [],
      onSelection: function (node, selected, $parentNode, $index, $first, $middle, $last, $odd, $even, $path) {
        // common var
        var jump = node.jump_to;
        var end = node.end;
        var id = node.tree_id;
        var root = node.top_tree_id;

        // for jump space
        if (jump) {
          vm.treeReason.selectedNodes.push(node);
          serviceTreeReason.getTreeInfo({
              tree_id: node.tree_id,
              case_no:vm.case.case_no,
              owner: sessionStorage.getItem("username")
            })
            .then(function (result) {
              if (!vm.treeReason.treeInfoModel.length) {
                vm.treeReason.treeInfoModel = result.body;
                vm.treeReason.treeInfoModel[0].template2_info = vm.treeReason.reasonPartContent + result.body[0].template2_info; //理由部分内容+所选的节点内容
              }
              if (vm.treeReason.treeInfoModel[0].template2_info.indexOf(vm.treeReason.reasonPartContent) == -1 && vm.treeReason.treeInfoModel[0].template2_info.indexOf(result.body[0].template2_info) == -1) {
                console.log(1)
                vm.treeReason.treeInfoModel[0].template2_info += vm.treeReason.reasonPartContent + result.body[0].template2_info; //理由部分内容+所选的节点内容
              } else if (vm.treeReason.treeInfoModel[0].template2_info.indexOf(vm.treeReason.reasonPartContent) > -1 && vm.treeReason.treeInfoModel[0].template2_info.indexOf(result.body[0].template2_info) == -1) {
                vm.treeReason.treeInfoModel[0].template2_info += result.body[0].template2_info; //理由部分内容+所选的节点内容
              }
              // console.log(vm.treeReason.treeInfoModel)
            })
            .then(function () {
              var target = undefined;
              if (jump == 96) {
                target = _.find(vm.treeReason.selectedTreeModel.next_nodes[3].next_nodes, {
                  'tree_id': jump
                });
              } else if (jump == 128) {
                target = _.find(vm.treeReason.selectedTreeModel.next_nodes[6].next_nodes, {
                  'tree_id': jump
                });
              } else if (jump == 144) {
                target = _.find(vm.treeReason.selectedTreeModel.next_nodes[7].next_nodes, {
                  'tree_id': jump
                });
              } else {
                target = _.find(vm.treeReason.selectedTreeModel.next_nodes, {
                  'tree_id': jump
                });
              }
              if (!target) {
                vm.treeReason.expandedNodes = [vm.treeReason.selectedTreeModel.next_nodes[0]];
                vm.treeReason.selectedNode = vm.treeReason.selectedTreeModel.next_nodes[0].next_nodes[1];
              } else {
                if (target.tree_id == 96) {
                  vm.treeReason.expandedNodes = [vm.treeReason.selectedTreeModel.next_nodes[3], target];
                  vm.treeReason.selectedNode = target;
                } else if (target.tree_id == 128) {
                  vm.treeReason.expandedNodes = [vm.treeReason.selectedTreeModel.next_nodes[6], target];
                  vm.treeReason.selectedNode = target;
                } else if (target.tree_id == 144) {
                  vm.treeReason.expandedNodes = [vm.treeReason.selectedTreeModel.next_nodes[7], target];
                  vm.treeReason.selectedNode = target;
                } else {
                  vm.treeReason.expandedNodes = [target];
                  vm.treeReason.selectedNode = target;
                }
              }
            })
        }
        // for end of process 
        else if (end) {
          vm.treeReason.selectedNodes.push(node);
          serviceTreeReason.getTreeInfo({
              tree_id: node.tree_id,
              case_no:vm.case.case_no,
              owner: sessionStorage.getItem("username")
            })
            .then(function (result) {
              if (vm.treeReason.treeInfoModel[0].template2_info.indexOf(vm.treeReason.reasonPartContent) == -1 && vm.treeReason.treeInfoModel[0].template2_info.indexOf(result.body[0].template2_info) == -1) {
                vm.treeReason.treeInfoModel[0].template2_info += vm.treeReason.reasonPartContent + result.body[0].template2_info; //理由部分内容+所选的节点内容
              } else if (vm.treeReason.treeInfoModel[0].template2_info.indexOf(vm.treeReason.reasonPartContent) > -1 && vm.treeReason.treeInfoModel[0].template2_info.indexOf(result.body[0].template2_info) == -1) {
                vm.treeReason.treeInfoModel[0].template2_info += result.body[0].template2_info; //理由部分内容+所选的节点内容
              }
            })
            .then(function () {
              vm.treeReason.option.isSelectable = function (node) {
                return root === 0;
              };
            })
            .then(function () {
              layer.msg("辅助生成流程结束");
            })
        } else {
          console.info(node);
        }
      },
      nodeToggle: function (node, $parentNode, $index, $first, $middle, $last, $odd, $even, $path) {
        if (node.parent_tree_id == 66 && node.tree_id >= 67 && node.tree_id <= 73) { //第三部分添加事实部分内容
          serviceTreeReason.getTreeInfo({
              tree_id: node.tree_id,
              case_no:vm.case.case_no,
              owner: sessionStorage.getItem("username")
            })
            .then(function (result) {
              if (result.body.length) {
                vm.treeReason.reasonPartContent = (result.body[0].template2_info) ? result.body[0].template2_info : "";
                //新建文书或重新生成的时候且经过确定vm.case.istemple=='0'时 自动替换
                if (vm.case.operation === "REDO" && vm.case.istemple == '0') {
                  //替换前恢复到默认模板，以免节点带有之前替换的内容
                  vm.template.article[2].nodes[0].nodes[1].content=vm.treeReason.the_plea_opinion_plea_opinion_defendant; //引用前的事实部分-诉辩意见-被告方诉辩意见内容(二)
                  vm.template.article[2].nodes[2].content =vm.treeReason.proof; //自动替换前的事实部分-举证质证内容
                  vm.template.article[2].nodes[3].nodes[0].content=vm.treeReason.proof_fact_proof_authentication;  //自动替换前的事实部分-证据事实认定-证据认定内容（一）
                  vm.template.article[2].nodes[3].nodes[1].content=vm.treeReason.proof_fact_proof_affirm; //自动替换前的事实部分-证据事实认定-事实认定内容
                  vm.template.article[3].content=vm.treeReason.reason ; //引用前的理由部分内容
                  var template1 = JSON.parse(result.body[0].template1_info);
                  for (var i in template1) {
                    if (template1[i].id == 'proof') { //举证质证
                      vm.template.article[2].nodes[2].content = template1[i].content;
                    } else if (template1[i].id == 'proof_authentication') { //证据事实认定-证据认定(一)
                      vm.template.article[2].nodes[3].nodes[0].content = template1[i].content;
                    } else if (template1[i].id == 'proof_affirm') { //证据事实认定-事实认定
                      vm.template.article[2].nodes[3].nodes[1].content = template1[i].content;
                    } else if (template1[i].id == 'plea_opinion_defendant') { //诉辩意见-被告方诉辩意见（二）
                      vm.template.article[2].nodes[0].nodes[1].content = template1[i].content;
                    }
                  }
                }
              }
            })
        } else if (node.parent_tree_id == 66 && node.tree_id >= 74 && node.tree_id <= 78) {
          console.log(vm.treeReason.selectedNodes)
          if (!vm.treeReason.selectedNodes.length) {
            layer.msg("由前到后顺序进行选择");
            vm.treeReason.expandedNodes = [vm.treeReason.selectedTreeModel.next_nodes[0]];
            vm.treeReason.selectedNode = vm.treeReason.selectedTreeModel.next_nodes[0];
          }
        }
      },
      getlevel1TreeInfo: function (node) {
        if (vm.treeReason.selectedTreeModel.tree_id == 1 || vm.treeReason.selectedTreeModel.tree_id == 29||vm.treeReason.selectedTreeModel.tree_id == 174) {
          serviceTreeReason.getTreeInfo({
              tree_id: vm.treeReason.selectedTreeModel.tree_id,
              case_no:vm.case.case_no,
              owner: sessionStorage.getItem("username")
            })
            .then(function (result) {
              if (result.body.length) {
                vm.treeReason.reasonPartContent = (result.body[0].template2_info) ? result.body[0].template2_info : "";
                // console.log(vm.treeReason.reasonPartContent)
                  //新建文书或重新生成的时候且经过确定vm.case.istemple=='0'时 自动替换
                if (vm.case.operation === "REDO" && vm.case.istemple == '0') {
                  //替换前恢复到默认模板，以免节点带有之前替换的内容
                  vm.template.article[2].nodes[0].nodes[1].content=vm.treeReason.the_plea_opinion_plea_opinion_defendant; //引用前的事实部分-诉辩意见-被告方诉辩意见内容(二)
                  vm.template.article[2].nodes[2].content =vm.treeReason.proof; //自动替换前的事实部分-举证质证内容
                  vm.template.article[2].nodes[3].nodes[0].content=vm.treeReason.proof_fact_proof_authentication;  //自动替换前的事实部分-证据事实认定-证据认定内容（一）
                  vm.template.article[2].nodes[3].nodes[1].content=vm.treeReason.proof_fact_proof_affirm; //自动替换前的事实部分-证据事实认定-事实认定内容
                  vm.template.article[3].content=vm.treeReason.reason ; //引用前的理由部分内容
                  var template1 = JSON.parse(result.body[0].template1_info);
                  for (var i in template1) {
                    if (template1[i].id == 'proof') { //举证质证
                      vm.template.article[2].nodes[2].content = template1[i].content;
                    } else if (template1[i].id == 'proof_authentication') { //证据事实认定-证据认定(一)
                      vm.template.article[2].nodes[3].nodes[0].content = template1[i].content;
                    } else if (template1[i].id == 'proof_affirm') { //证据事实认定-事实认定
                      vm.template.article[2].nodes[3].nodes[1].content = template1[i].content;
                    } else if (template1[i].id == 'plea_opinion_defendant') { //诉辩意见-被告方诉辩意见（二）
                      vm.template.article[2].nodes[0].nodes[1].content = template1[i].content;
                    }
                  }
                }
              }
            })
        } 

      },
      reset: function () {
        //替换前恢复到默认模板，以免节点带有之前替换的内容
        vm.template.article[2].nodes[0].nodes[1].content=vm.treeReason.the_plea_opinion_plea_opinion_defendant; //引用前的事实部分-诉辩意见-被告方诉辩意见内容(二)
        vm.template.article[2].nodes[2].content =vm.treeReason.proof; //自动替换前的事实部分-举证质证内容
        vm.template.article[2].nodes[3].nodes[0].content=vm.treeReason.proof_fact_proof_authentication;  //自动替换前的事实部分-证据事实认定-证据认定内容（一）
        vm.template.article[2].nodes[3].nodes[1].content=vm.treeReason.proof_fact_proof_affirm; //自动替换前的事实部分-证据事实认定-事实认定内容
        vm.template.article[3].content=vm.treeReason.reason ; //引用前的理由部分内容
        vm.template.article[3].content = vm.treeReason.reason;
        vm.treeReason.expandedNodes = [];
        vm.treeReason.treeInfoModel = "";
        vm.treeReason.option.isSelectable = function (node) {
          return true;
        };
      },
      quote: function () {
        $(".reason").addClass("active");
        $(".reason").parent("ul").children("li").not(".reason").removeClass("active");
        $("#reason").focus();
        vm.treeReason.pre_reasonPart = vm.template.article[3].content;
        vm.template.article[3].content = vm.treeReason.treeInfoModel[0].template2_info;
      }
    };

    // Tree result
    vm.treeResult = {
      option: {
        nodeChildren: "next_nodes",
        dirSelectable: false,
        multiSelection: false
      },
      treeModel: {},
      treeInfoModel: "",
      getTree: function () {
        serviceTreeResult.getTree()
          .then(function (result) {
            console.log(vm.template.article[5].content)
            vm.treeResult.treeModel = result.body;
          })
      },
      // access tree
      expandNodes: [],
      selectedNodes: [],
      multipleIndex: 0,
      paragrap1 :"",//保存第三部分第一次选择的节点内容，因为不是多选是不会有一、
      onSelection: function (node, selected, $parentNode) {
        if ($parentNode && $parentNode.multiple && selected) { //多选
          serviceTreeResult.getTreeInfo({
              tree_id: node.tree_id,
              owner: sessionStorage.getItem("username")
            })
            .then(function (result) {
              if (vm.treeResult.treeInfoModel.indexOf(result.body[0].template1_info) == -1 && vm.treeResult.treeInfoModel) {
                if(vm.treeResult.paragrap1 !=""){
                  vm.treeResult.treeInfoModel =vm.treeResult.paragrap1;
                  vm.treeResult.paragrap1="";
                }
                vm.treeResult.treeInfoModel += $sce.trustAsHtml(
                  "<p>" + serviceTemplate.serialNumber(++vm.treeResult.multipleIndex) + "、" +
                  result.body[0].template1_info + "</p>"
                  // "<p>" + vm.treeResult.treeInfoModelPreset + "</p>"
                );
              }else if(!vm.treeResult.treeInfoModel){
                vm.treeResult.paragrap1 ="<p>" + serviceTemplate.serialNumber(++vm.treeResult.multipleIndex) + "、" +
                  result.body[0].template1_info + "</p>";
                var ss =result.body[0].template1_info.replace("；","。");
                vm.treeResult.treeInfoModel ="<p>"+ss+ "</p>";
              }
            })
        } else if ($parentNode && $parentNode.multiple && !selected) { //多选节点时，多次点击某个节点，防止取消选中此节点样式
          vm.treeResult.selectedNodes.push(node)
        } else if (!node.parent_tree_id && !node.multiple && selected) { //单选
          serviceTreeResult.getTreeInfo({
              tree_id: node.tree_id,
              owner: sessionStorage.getItem("username")
            })
            .then(function (result) {
              vm.treeResult.treeInfoModel = $sce.trustAsHtml("<p>" + result.body[0].template1_info + "</p>").toString();
            })
        }
      },
      // treeInfoModelPreset: "",
      onNodeToggle: function (node, selected, $parentNode) {
        // serviceTreeResult.getTreeInfo({
        //     tree_id: node.tree_id,
        //     owner: sessionStorage.getItem("username")
        //   })
        //   .then(function (result) {
        //     vm.treeResult.treeInfoModelPreset = result.body[0].template2_info;
        //   })
        if (!$parentNode && node.multiple) { //选中多选的父级节点时，清空vm.treeResult.treeInfoModel的内容，即清除选一或者二中情况时的内容
          if (!vm.treeResult.selectedNodes.length) {
            vm.treeResult.treeInfoModel = "";
          }
        }
        vm.treeResult.option.isSelectable = function (eachNode) {
          return node.tree_id === eachNode.tree_id || node.tree_id === eachNode.parent_tree_id;
        }
        vm.treeResult.option.multiSelection = true;
      },
      reset: function () {
        vm.template.article[5].content=vm.judgments_results ; //引用前的 裁判结果 部分内容
        vm.treeResult.multipleIndex = 0;
        this.option.multiSelection = false;
        this.option.isSelectable = function () {
          return true;
        }
        this.expandedNodes = [];
        this.selectedNodes = [];
        this.treeInfoModel = "";
      },
      quote: function () {
        $(".judgments_results").addClass("active");
        $(".judgments_results").parent("ul").children("li").not(".judgments_results").removeClass("active");
        $(".judgments_results").children("a").addClass("font-bold");
        $("#judgments_results").focus();
        vm.template.article[5].content = vm.treeResult.treeInfoModel;
      }
    };

    // Operation
    vm.operation = {
      errorCorrection: function () {
        serviceOperation.getCorrection({
          basic: $("#participant").text(),
          content: $("#judgment-content").text()
        }).then(function (data) {
          var illegal = data.illegal_words;
          var s = $("#judgment-content").html();
          for (var i = 0, len = illegal.length; i < len; i++) {
            // console.log(illegal[i])
            s = s.replace(eval('/' + (illegal[i]) + '/g'), '<span style="border-bottom:1px dashed #F00;">' + illegal[i] + '</span>');
          }
          $("#judgment-content").html(s);
        })
      },
      export: function () {
        var article = $("#judgment").parent().html().trim().replace(/section/g, "p");
        window.saveAs(htmlDocx.asBlob(article), vm.case.title + '.docx');
      },
      print: function () {
        var printContent = $("#judgment").parent().html().replace(/section/g, "p");
        printContent.replace('<span style="border-bottom:1px dashed #F00;">', "");
        printContent.replace('</span>', "");
        $window.document.body.innerHTML = printContent;
        $window.print();
        $state.go("cases");
        $window.location.reload();
      },
      getsimilarCase: function (accord) {
        console.log({
          accord: accord,
          court_name: vm.case.court_name
            // judger:
        });
        serviceOperation.getSimilarCase({
          accord: accord,
          court_name: vm.case.court_name
            // judger:
        }).then(function (data) {
          console.log(data)
          vm.operation.similars = data;
        })
      },
      getLaws: function (discern) {
        serviceOperation.getlaws({
          discern: discern
        }).then(function (data) {
          console.log(data)
          vm.operation.laws = data;
        })
      },
      formula: {
        init: function () {
          //财产诉讼费用计算
          new Clipboard('.copy'); //复制到剪切板
          //财产诉讼利息计算--时间参数配置
          vm.date = {};
          vm.date.dateOptions1 = {
              format: 'yyyy-MM-dd',
              maxDate: new Date(),
              minDate: new Date(1900),
              startingDay: 1,
            } //日期插件参数
          vm.date.dateOptions2 = {
            format: 'yyyy-MM-dd',
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
        },
        //财产诉讼利息计算--还款时间设置
        changeDate: function () {
          var startTime = vm.operation.formula.fee.start_time;
          console.log(startTime)
          vm.date.dateOptions2 = {
            format: 'yyyy-MM-dd',
            minDate: startTime,
            startingDay: 1,
          }
        },
        //财产诉讼费用计算--原被告负担费用
        getCceptanceFee: function (value, flag) {
          console.log(value)
            //flag 0表示原告，1表示被告
            //原告输入框失去焦点
          if (value.accuser_fee && !flag) {
            $('#fee4').attr("disabled", true)
            var result = Number(value.court_acceptance_fee) + Number(value.attachment_fee) - Number(value.accuser_fee);
            value.defendant_fee = (result > 0) ? result : "";
            if (value.defendant_fee == "") {
              layer.msg("原告负担费用大于案件受理费用+案件保全费用")
              value.accuser_fee = "";
            }

          }
          //被告输入框失去焦点
          if (value.defendant_fee && flag) {
            $('#fee3').attr("disabled", true)
            var result = Number(value.court_acceptance_fee) + Number(value.attachment_fee) - Number(value.defendant_fee);
            value.accuser_fee = (result > 0) ? result : "";
            if (value.accuser_fee == "") {
              layer.msg("被告负担费用大于案件受理费用+案件保全费用")
              value.defendant_fee = "";
            }
          }
        },
        fee: {}, //财产诉讼利息计算参数
        //财产诉讼费用计算
        getRate: function () {
          $("#rate").val($("#rate_default").val());
        },
        ////财产诉讼利息计算--利息总计
        getInterests: function (isvalid) {
          console.log(isvalid, this.fee)
          var d1 = this.fee.start_time,
            d2 = this.fee.end_time;
          if (d1 && d2) {
            var obj = {},
              M1 = d1.getMonth(),
              D1 = d1.getDate(),
              M2 = d2.getMonth(),
              D2 = d2.getDate();
            obj.Y = d2.getFullYear() - d1.getFullYear();
            obj.M = obj.Y * 12 + M2 - M1;
            obj.s = Math.floor((d2 - d1) / 1000); //差几秒
            obj.m = Math.floor(obj.s / 60); //差几分钟
            obj.h = Math.floor(obj.m / 60); //差几小时
            obj.D = Math.floor(obj.h / 24); //差几天  
          }
          if (isvalid) {
            if (this.fee.rate_default == "0.066") {
              var rate = (this.fee.rate) ? this.fee.rate : 0.066;
              console.log(obj.D, rate)
              if (obj.D > 0) {
                this.fee.interest_total = (this.fee.principal * obj.D * rate * 0.01).toFixed(2);
              } else {
                layer.msg("请输入正确的还款时间")
              }
            } else if (this.fee.rate_default == "2.00") {
              var rate = (this.fee.rate) ? this.fee.rate : 2.00;
              console.log(obj.M, (obj.D % 12), rate)
              if (obj.D > 0) {
                this.fee.interest_total = (this.fee.principal * obj.M * rate * 0.01 + this.fee.principal * rate / 30 * (obj.D % 12) * 0.01).toFixed(2);
              } else {
                layer.msg("请输入正确的还款时间")
              }
            } else if (this.fee.rate_default == "24.00") {
              var rate = (this.fee.rate) ? this.fee.rate : 24.00;
              console.log(obj.Y, (obj.D % 365), rate)
              if (obj.D > 0) {
                this.fee.interest_total = (this.fee.principal * obj.Y * rate * 0.01 + this.fee.principal * rate / 365 * (obj.D % 365) * 0.01).toFixed(2);
              } else {
                layer.msg("请输入正确的还款时间")
              }
            }
          } else {
            layer.msg("请正确填写计算利息必要的信息")
          }

        }

      }
    }

    // Popover
    vm.popover = {
      law: "./partials/judge/view.popover.law.html",
      info: "./partials/judge/view.popover.info.html",
      similar: "./partials/judge/view.popover.similar.html",
      history: "./partials/judge/view.popover.history.html",
      formula: "./partials/judge/view.popover.formula.html"
    };

    // Material
    vm.material = {
      image: "", // for target image in the modal
      images: [], // for file upload list
      ocrModal: {},
      ocrResult: {},
      openOcrModal: function (image) {
        this.image = image;
        this.ocrModal = $uibModal.open({
          templateUrl: "./partials/judge/view.modal.ocr.html",
          size: "lg",
          scope: $scope,
          keyboard: true,
          backdrop: 'static',
          windowClass: "modal-material-ocr modal-default",
        });
        vm.material.ocrResult =[];
      },
      closeOcrModal: function () {
        this.ocrModal.close();
      },
      ocrMaterial: function (image) {
        vm.promise =serviceMaterial.ocr({
            url: image
          })
          .then(function (results) {
            layer.msg(results.message);
            vm.material.ocrResult = results.result.res;
            console.log(results.result.res);
          })
      },
      downloader: function () {
        serviceMaterial.downloader({
            case_no: $stateParams.case_no
          })
          .then(function (result) {
            // if(!result.body){
            //  layer.msg("当前案号没有查出相关案件材料")
            // }
            vm.material.images = result.body;
            console.log(result.body)
          })
      },
      uploader: new FileUploader({
        url: URL.master + "/legal_case/uploadCaseFiles",
        method: "POST",
        withCredentials: true,
        headers: {
          "Authorization": "Wiserv " + sessionStorage.token
        },
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
        formData: [{
          case_no: $stateParams.case_no
        }],
        queueLimit: 100,
        remove : function(item){
          if(item.isUploaded){
           serviceMaterial.deletePicture({
            case_no: $stateParams.case_no,
            file_name:item.file.name
          })
          .then(function (data) {
            if (verify(data, 200)) {
              vm.material.downloader();
            }else{
              layer.msg(data.head.message)
            }
          })
          }
          item.remove();
        },
        onSuccessItem: function (item, response, status, headers) {
          // vm.material.image = response.body[0].url;
          layer.msg(response.head.message);
        },
        onCompleteAll: function () {
          vm.material.downloader();
        },
        onErrorItem: function (item, response, status, headers) {
          layer.msg(response.head.message);
        }
      })
    };

    activate();
  };


})();