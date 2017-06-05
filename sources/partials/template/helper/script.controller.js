(function () {

  angular
    .module("app.template.helper")
    .controller("HelperController", HelperController);

  HelperController.$inject = ["$sce",
    "$window", "helperService", "verify"
  ];

  function HelperController($sce,
    $window, helperService, verify) {
    var vm = this;
    // Tree reason
    vm.treeReason = {
      option: {
        nodeChildren: "next_nodes",
        dirSelectable: false,
      },
      treeModel: {},
      treeInfoModel: {},
      defaultTreeModel: {},
      selectedTreeModel: {},
      getTree: function () {
        helperService.getTree()
          .then(function (result) {
            vm.treeReason.treeModel = result.body;
            vm.treeReason.selectedTreeModel = vm.treeReason.treeModel[0];
          })
      },
      // access tree
      expandNodes: [],
      selectedNode: {},
      selectedNodes: [],
      onSelection: function (node, $parentNode, $index, $first, $middle, $last, $odd, $even, $path) {
        // common var
        var jump = node.jump_to;
        var end = node.end;
        var id = node.tree_id;
        var root = node.top_tree_id;
        // for jump space
        if (jump) {
          vm.treeReason.selectedNodes.push(root);
          helperService.getTreeInfo({
              tree_id: node.tree_id,
              owner: sessionStorage.getItem("username")
            })
            .then(function (result) {
              vm.treeReason.treeInfoModel = result.body;
            })
            .then(function () {
              var target = _.find(vm.treeReason.selectedTreeModel.next_nodes, {
                'tree_id': jump
              });
              if (!target) {
                vm.treeReason.expandedNodes = [vm.treeReason.selectedTreeModel.next_nodes[0]];
                vm.treeReason.selectedNode = vm.treeReason.selectedTreeModel.next_nodes[0].next_nodes[1];
              } else {
                vm.treeReason.expandedNodes = [target];
                vm.treeReason.selectedNode = target;
              }
            })
        }
        // for end of process 
        else if (end) {
          vm.treeReason.selectedNodes.push(root);
          helperService.getTreeInfo({
              tree_id: node.tree_id,
              owner: sessionStorage.getItem("username")
            })
            .then(function (result) {
              vm.treeReason.treeInfoModel = result.body;
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
      save: function (param) {
        console.log(param)
        helperService.saveTreeInfo({
         auto_id:param.auto_id,
          tree_id:param.tree_id,
          owner:param.owner,
          tree_name:param.tree_name,
          template1_info:param.template1_info,
          template1_explain:"事实部分的模板",
          template2_info:param.template2_info,
          template2_explain:"理由部分的模板"
        })
          .then(function (data) {
            if (verify(data, 200)) {
              layer.msg(data.head.message, {
                time: 3000,
                icon: 6
              });
            }else{
              layer.msg(data.head.message, {
                time: 3000,
                icon: 5
              }); 
            }
          })
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
        helperService.getResultTree()
          .then(function (result) {
            vm.treeResult.treeModel = result.body;
          })
      },
      // access tree
      expandNodes: [],
      selectedNodes: [],
      multipleIndex: 0,
      onSelection: function (node, $parentNode) {
        if ($parentNode && $parentNode.multiple) {
          console.info("多选");
          helperService.getResultTreeInfo({
              tree_id: node.tree_id,
              owner: sessionStorage.getItem("username")
            })
            .then(function (result) {
              vm.treeResult.treeInfoModelParam=result.body[0];
              vm.treeResult.treeInfoModel += $sce.trustAsHtml(
                "<p>" + serviceTemplate.serialNumber(++vm.treeResult.multipleIndex) + "、" +
                result.body[0].template1_info + "</p>" +
                "<p>" + vm.treeResult.treeInfoModelPreset + "</p>"
              );
            })
        } else {
          console.info("单选");
          helperService.getResultTreeInfo({
              tree_id: node.tree_id,
              owner: sessionStorage.getItem("username")
            })
            .then(function (result) {
               vm.treeResult.treeInfoModelParam=result.body[0];
              vm.treeResult.treeInfoModel = $sce.trustAsHtml("<p>" + result.body[0].template1_info + "</p>").toString();
            })
        }
      },
      treeInfoModelPreset: "",
      onNodeToggle: function (node) {
        helperService.getResultTreeInfo({
            tree_id: node.tree_id,
            owner: sessionStorage.getItem("username")
          })
          .then(function (result) {
             vm.treeResult.treeInfoModelParam=result.body[0];
            vm.treeResult.treeInfoModelPreset = result.body[0].template2_info;
          })
        vm.treeResult.option.isSelectable = function (eachNode) {
          return node.tree_id === eachNode.tree_id || node.tree_id === eachNode.parent_tree_id;
        }
        vm.treeResult.option.multiSelection = true;
      },
      save: function (param) {
        console.log(param)
        helperService.saveResultTreeInfo({
         auto_id:param.auto_id,
          tree_id:param.tree_id,
          owner:param.owner,
          tree_name:param.tree_name,
          template1_info:param.template1_info,
          template1_explain:"裁判结果",
          template2_info:param.template2_info,
          template2_explain:"目录下多选结尾词"
        })
          .then(function (data) {
            if (verify(data, 200)) {
              layer.msg(data.head.message, {
                time: 3000,
                icon: 6
              });
            }else{
              layer.msg(data.head.message, {
                time: 3000,
                icon: 5
              }); 
            }
          })
      }
    };

    activate();

    function activate() {
      vm.treeReason.getTree();
      vm.treeResult.getTree();
    };
  };

})();