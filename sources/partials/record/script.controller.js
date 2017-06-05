(function() {
  angular
    .module("app.record")
    .controller("RecordController", RecordController);

  RecordController.$inject = ["$scope", "$rootScope", "$state", "recordService", "$filter", "verify", "$compile", '$location', '$anchorScroll', "$stateParams", "$uibModal", "serviceRecordData"];

  function RecordController($scope, $rootScope, $state, recordService, $filter, verify, $compile, $location, $anchorScroll, $stateParams, $uibModal, serviceRecordData) {
    var vm = this;
    vm.duties_flag = true,
    vm.objection_flag = true,
    vm.debarb_flag = true,
    vm.need_flag = true,
    vm.reconcile_flag = true,
    vm.fixed_flag = true,
    vm.attendance_flag = true;
    vm.defendant_part_flag = true;
    vm.thirdPeop_part_flag = true;
    vm.third_man_flag = true;
    vm.toMediate_flag = true;
    vm.asked_flag = true;
    //添加庭审笔录
    vm.trialArray = ['1', '2', '3'];
    //添加辩论次数
    vm.debateArray = [];
    vm.debate = 1;

    var stamp = 3,
      _lastEditRange, //存储最后一次光标的信息
      _contentDom = $('#record-content'); //模板内容区 

    vm.addTrial = function(type) {
      if (type === 'trial') {
        stamp++;
        vm.trialArray.push(stamp);
      } else if (type === 'debate') {
        vm.debateArray = [];
        vm.debate++;
        for (var i = 1, len = vm.debate; i < len; i++) {
          vm.debateArray.push({
            count: i
          });
        }
      }
    };
    //删除评论次数
    vm.delDebate = function(type, index) {
      if (type === 'trial') {

      } else if (type === 'debate') {
        vm.debateArray.splice(index, 1);
        vm.debate--;
        layer.msg("删除成功~")
      }
    };
    //锚点调整
    vm.goContent = function(str){
      $('.undo').removeClass('selected');
      $location.hash(str);
      $anchorScroll();
      $('#'+str).addClass('selected');
      try{
        // 获取选定对象
        var selection = window.getSelection();
        //获取光标对象
        var range = selection.getRangeAt(0);
        //设置光标位置
        range.setStart($('#'+str)[0], 0);
        //光标开始和光标结束重叠
        range.collapse(true);
        // 清除选定对象的所有光标对象
        selection.removeAllRanges();
        // 插入新的光标对象
        selection.addRange(range);
      }catch(e){

      }
    };

    //绑定点击事件存储光标最后一次位置
    $(document).on('click', '#record-content', function() {
      $('.undo').removeClass('selected');
      try{
        // 获取选定对象
        var selection = window.getSelection();
        // 设置最后光标对象
        _lastEditRange = selection.getRangeAt(0);
      }catch(e){}
    });

    var now = function() {
      var now = new Date();
      var year = now.getFullYear();
      var month = now.getMonth() + 1;
      var day = now.getDate();
      var currentDate = year + '-' + month + '-' + day;
      return (currentDate);
    }
    vm.time = {
      //开庭时间
      startDate: new Date(now()),
      startTime: new Date(1984, 4, 15, 19, 20),
      times: 1
    };
    
    vm._showObj = {};

    //get service data
    serviceRecordData.setPerson('accuserList', $stateParams.accuser, $stateParams.accuser_baseinfo);
    serviceRecordData.setPerson('defendantList', $stateParams.defendant, $stateParams.defendant_baseinfo);
    serviceRecordData.setPerson('thirdPeopleList', $stateParams.third_man, $stateParams.third_man_baseinfo);
    vm._selectConditionMap = serviceRecordData._selectConditionMap;
    vm.personList = serviceRecordData.personList;
    vm.data = serviceRecordData.data;
    vm.event = {
        name:'',
        number:'',
        judgeShow: function(id) {
          if(id === 1){
            vm.duties_flag = true;
            vm.data.program = '普通程序'
          }else{
            vm.duties_flag = false;
            vm.data.program = '简易程序'
          }
        },
        inputEvent: function(e) {
          //$(e.target).focus();
        },
        toCourtChange: function(obj) {
          obj.toCourt === 1 ? (obj.show_flag = true) : (obj.show_flag = false); 
          showSeating();
          getAbsentee(); //存储未到庭人员 （诉讼地位名：姓名）
          getToCourt() ;//存储到庭人员 （诉讼地位名：姓名）
        },
        lagalAgentChange: function (obj){
          //控制法定代表，代理，指定代理显示或隐藏
          switch (obj.legalSelect) {
            case 1:
              obj.legalShortA = "原";
              obj.legalShortB = "被";
              obj.legalShortT = "第";
            break;
            case 2:
              obj.legalShortA = "原";
              obj.legalShortB = "被";
              obj.legalShortT = "第";
            break;
            case 3:
              obj.legalShortA = "法代";
              obj.legalShortB = "法代";
              obj.legalShortT = "法代";
            break;
            case 4:
              obj.legalShortA = "指代";
              obj.legalShortB = "指代";
              obj.legalShortT = "指代";
          }
        },
        objectionChange: function(obj) {
          obj.objection === 1 ? (obj.objection_flag = true) : (obj.objection_flag = false); // 控制有无异议显示输入框
          obj.avoid === 1 ? (obj.avoid_flag = true) : (obj.avoid_flag = false); //申请回避显示输入框
          obj.objection_open === 1 ? (obj.objection_open_flag = true) : (obj.objection_open_flag = false); //控制出庭人员有无异议显示输入框
          obj.askedtoadd === 1 ? (obj.askedtoadd_flag = true) : (obj.askedtoadd_flag = false); // 控制交叉询问补充显示输入框
          obj.peace === 1 ? (obj.reconcile_flag = true) : (obj.reconcile_flag = false);//不愿意调解显示不愿意调解理由输入框
          toMediate();
        },
        questionChange:function(data){
          var _this = this;
          recordService.getElementsById.get({
            ele_id: data
          }).then(function(results) {
            _this._data = creatPartiesQuestion(results.data.body);
            vm.data.partiesQuestion = _this._data.partiesQuestionArray;
            for (var i = 0; i < _this._data.answerArray.length; i++) {
              vm.data.allQuestion.push(_this._data.answerArray[i])
              
            }
          })
        },
        partiesChange:function(id){
          var _this = this,
              _array = _this._data.answerArray,
              i = 0,len = _array.length;

          for(; i < len ; i++){
            if(id === _array[i]._id){
              vm.data.answerData.push(_array[i]);
              break;
            }
          }    

        },
        //询问阶段删除问题
        delCurr: function(index){
          vm.data.allQuestion.splice(index, 1)
        },
        checkName: function(e){
         this.name = $(e.target).val();
        },
        setNameFormat: function(name,e){
          var regx = /^[\u4E00-\u9FA5A-Za-z\s]+$/;
          if (vm.data.judge_info[name].length === 2) {
            var value = vm.data.judge_info[name].replace(/\s+/g, '');
            var nameArr = [];
            nameArr[0] = value.substr(0, 1);
            value.substr(1, 2) ? nameArr[1] = value.substr(1, 2) : 0;
            vm.data.judge_info[name] = nameArr.join(' ');
          }
          if(!vm.data.judge_info[name]){
           // layer.msg('姓名不能为空')
          }else if(vm.data.judge_info[name].length >= 50){
            layer.msg('字符过长');
            vm.data.judge_info[name] = this.name;
          }else if(!regx.test(vm.data.judge_info[name])){
            layer.msg('姓名只能为汉字或英文');
            vm.data.judge_info[name] = this.name;
          }
        },
        setPersonFormat:function(name,index,e){
          var regx = /^[\u4E00-\u9FA5A-Za-z\s]+$/;
          if(!vm.personList[name][index].name){
           // layer.msg('姓名不能为空')
          }else if(vm.personList[name][index].name.length >= 50){
            layer.msg('字符过长');
            vm.personList[name][index].name = this.name;
          }else if(!regx.test(vm.personList[name][index].name)){
            layer.msg('姓名只能为汉字或英文');
            vm.personList[name][index].name = this.name;
          }
        },
        setNumberFormat:function(name){
          var regx = /^\d{1,3}$/;
          if(!regx.test(vm.data[name])){
            layer.msg('请输入小于三位数的数字');
            vm.data[name] = this.number;
          }
        },
        deleteRecord:function(record_id,case_no){
          layer.open({
          content: '确认删除？',
          yes: function(index, layero) {
               console.log(case_no)
              recordService.deleteRecord.delete({
                  record_id: record_id,
                  case_no: case_no
                })
                .then(function(data) {
                  if (verify(data, 200)) {
                    layer.msg(data.head.message, {
                      time: 2000,
                      icon: 6
                    })
                    getRcordList();
                  } else {
                    layer.msg(data.head.message, {
                      time: 2000,
                      icon: 5
                    })
                  }
                })
                  layer.close(index);
                  }
                });
        },
        replacePerson:function(type){
          switch(type){
            case "ordinary":
              $('#change-ordinary').css({display:"inline"});
              $('#ordinary-button').css({display:"none"});
            break;
            case "simple":
              $('#change-simple').css({display:"inline"});
              $('#simple-button').css({display:"none"});
            break;
          }
        },
        ordinaryDelete:function(type){
          switch(type){
            case "ordinary":
              $('#change-ordinary').css({display:"none"});
              $('#ordinary-button').css({display:"inline"});
            break;
            case "simple":
              $('#change-simple').css({display:"none"});
              $('#simple-button').css({display:"inline"});
            break;
          }
        },
        anchor: function (id) {
        $('#' + id).focus();
        $anchorScroll(id);
      }
    }
    //控制是否全部愿意调解显示框
    function toMediate(){
        var array = [];
        for (var i in vm.personList) {
          vm.personList[i].forEach(function(item) {
            if (item.peace === 2) {
              array.push({
                type: item.type,
                name: item.name
              }) 
            }
          });
        }
        vm.data.toMediateMan = array;
        vm.data.toMediateMan.length ? (vm.toMediate_flag = false) : (vm.toMediate_flag = true)
    }
         
    //控制出庭人员显示
    function showSeating() {
      var allList = [],
        defendant = [],
        thirdPeop = [],
        tempArray_1, tempArray_2, tempArray_3;
        allList = allList.concat(vm.personList.defendantList, vm.personList.thirdPeopleList, vm.personList.agentDefendantList, vm.personList.agentThirdPeopleList, vm.personList.agentDefendantLegal, vm.personList.agentThirdPeopleLegal);
        defendant = defendant.concat(vm.personList.defendantList, vm.personList.agentDefendantList, vm.personList.agentDefendantLegal);
        thirdPeop = thirdPeop.concat(vm.personList.thirdPeopleList, vm.personList.agentThirdPeopleList, vm.personList.agentThirdPeopleLegal);

        tempArray_1 = allList.filter(function(item) {
          return item.show_flag === true;
        });
        tempArray_2 = defendant.filter(function(item) {
          return item.show_flag === true;
        });
        tempArray_3 = thirdPeop.filter(function(item) {
          return item.show_flag === true;
        });

      /**全部缺席和全部到庭 start**/
      if (tempArray_2.length && tempArray_3.length || tempArray_2.length && !thirdPeop.length) {
        vm.attendance_flag = true;
      } else if (!tempArray_2.length && !tempArray_3.length) {
        vm.attendance_flag = false
      }
      /** end **/

      /**部分缺席显示字段 start**/
      tempArray_2.length ? (vm.defendant_part_flag = true) : (vm.defendant_part_flag = false);
      tempArray_3.length ? (vm.thirdPeop_part_flag = true) : (vm.thirdPeop_part_flag = false);
      tempArray_3.length ? (vm.third_man_flag = true) : (vm.third_man_flag = false);
      if(!thirdPeop.length){
         vm.thirdPeop_part_flag = true
         vm.third_man_flag = false
      }
      /** end **/
    }

    //Date
    vm.opened = {};
    vm.open = function($event, elementOpened) {
      $event.preventDefault();
      $event.stopPropagation();
      vm.opened[elementOpened] = !vm.opened[elementOpened];
    };
    //添加委托代理人的点击事件
    vm.addBailor = function(type) {
      /** 
       * 0:原告、1:被告、2:第三人、3:原告代理、4:被告代理、5:第三人代理
       */

      switch (type) {
        case '0':
          vm.personList.accuserList.push({
            show_flag: true, //控制未到庭隐藏
            toCourt: 1, // 默认到庭状态
            avoid: 1, // 是否申请回避
            debarbReason: '',//申请回避理由
            avoid_flag: true,
            agree: 1, //是否同意开庭,
            objection_open_flag: true,
            objection_open_Reason: '',//异议理由
            objection_open: 1, //对证据期限有无异议
            objection: 1, //是否有异议 1: 无异议
            objectionReason: '', //有异议的理由
            objection_flag: true, //控制有理由显示input
            objection_no_controversy: 1, //无争议有异议
            no_controversy_isAdd: 1, //无争议补充
            objection_controversy: 1, //有争议有异议
            controversy_isAdd: 1, //有争议补充
            askedtoadd: 1, //是否交叉询问补充
            askedtoadd_flag: true, //控制有交叉补充显示INPUT
            askedtoaddReason: '',//需要询问或补充的内容
            peace:1,//是否愿意调解
            reconcile_flag: true,
            reconcileReason:"",//不愿调解理由
            info: '', //原告人员信息
            name: '', //原告姓名
            type:'原告'
        });
          break;
        case '1':
          vm.personList.defendantList.push({
            show_flag: true,
            toCourt: 1,
            avoid: 1, // 是否申请回避
            debarbReason: '',//申请回避理由
            avoid_flag: true,
            agree: 1, //是否同意开庭,
            objection_open_flag: true,
            objection_open_Reason: '',//异议理由
            objection_open: 1, //对证据期限有无异议
            objection: 1, //是否有异议 1: 无异议
            objectionReason: '', //有异议的理由
            objection_flag: true, //控制有理由显示input
            objection_no_controversy: 1, //无争议有异议
            no_controversy_isAdd: 1, //无争议补充
            objection_controversy: 1, //有争议有异议
            controversy_isAdd: 1, //有争议补充
            askedtoadd: 1, //是否交叉询问补充
            askedtoadd_flag: true, //控制有交叉补充显示INPUT
            askedtoaddReason: '',//需要询问或补充的内容
            peace:1,//是否愿意调解
            reconcile_flag: true,
            reconcileReason:"",//不愿调解理由
            info: '',
            name: '',
            type:'被告'
          });
          break;
        case '2':
          vm.personList.thirdPeopleList.push({
            show_flag: true,
            toCourt: 1,
            avoid: 1, // 是否申请回避
            debarbReason: '',//申请回避理由
            avoid_flag: true,
            agree: 1, //是否同意开庭,
            objection_open_flag: true,
            objection_open_Reason: '',//异议理由
            objection_open: 1, //对证据期限有无异议
            objection: 1, //是否有异议 1: 无异议
            objectionReason: '', //有异议的理由
            objection_flag: true, //控制有理由显示input
            objection_no_controversy: 1, //无争议有异议
            no_controversy_isAdd: 1, //无争议补充
            objection_controversy: 1, //有争议有异议
            controversy_isAdd: 1, //有争议补充
            askedtoadd: 1, //是否交叉询问补充
            askedtoadd_flag: true, //控制有交叉补充显示INPUT
            askedtoaddReason: '',//需要询问或补充的内容
            peace:1,//是否愿意调解
            reconcile_flag: true,
            reconcileReason:"",//不愿调解理由
            info: '',
            name: '',
            type:'第三人'
          });
          break;
        case '3':
          if(vm.personList.agentAccuserList.length < 2){
            vm.personList.agentAccuserList.push({
              show_flag: true,
              toCourt: 1,
              avoid: 1, // 是否申请回避
              debarbReason: '',//申请回避理由
              avoid_flag: true,
              agree: 1, //是否同意开庭,
              objection_open_flag: true,
              objection_open_Reason: '',//异议理由
              objection_open: 1, //对证据期限有无异议
              warrant: 1, // 授权状态值
              objection: 1, //是否有异议 1: 无异议
              objectionReason: '', //有异议的理由
              objection_flag: true, //控制有理由显示input
              objection_no_controversy: 1, //无争议有异议
              no_controversy_isAdd: 1, //无争议补充
              objection_controversy: 1, //有争议有异议
              controversy_isAdd: 1, //有争议补充
              askedtoadd: 1, //是否交叉询问补充
              askedtoadd_flag: true, //控制有交叉补充显示INPUT
              askedtoaddReason: '',//需要询问或补充的内容
              peace:1,//是否愿意调解
              reconcile_flag: true,
              reconcileReason:"",//不愿调解理由
              info: '',
              name: '',
              type:'原告代理'
            });
        }else{
          layer.msg('最多只能添加1位')
        } 
          break;
        case '4':
          if(vm.personList.agentDefendantList.length < 2){
            vm.personList.agentDefendantList.push({
            show_flag: true,
            toCourt: 1,
            avoid: 1, // 是否申请回避
            debarbReason: '',//申请回避理由
            avoid_flag: true,
            agree: 1, //是否同意开庭,
            objection_open_flag: true,
            objection_open_Reason: '',//异议理由
            objection_open: 1, //对证据期限有无异议
            objection: 1, //是否有异议 1: 无异议
            objectionReason: '', //有异议的理由
            objection_flag: true, //控制有理由显示input
            objection_no_controversy: 1, //无争议有异议
            no_controversy_isAdd: 1, //无争议补充
            objection_controversy: 1, //有争议有异议
            controversy_isAdd: 1, //有争议补充
            askedtoadd: 1, //是否交叉询问补充
            askedtoadd_flag: true, //控制有交叉补充显示INPUT
            askedtoaddReason: '',//需要询问或补充的内容
            peace:1,//是否愿意调解
            reconcile_flag: true,
            reconcileReason:"",//不愿调解理由
            warrant: 1,
            info: '',
            name: '',
            type:'被告代理'
        });
        }else{
          layer.msg('最多只能添加1位')
        }
          break;
        case '5':
          if(vm.personList.agentThirdPeopleList.length < 2){
            vm.personList.agentThirdPeopleList.push({
            show_flag: true,
            toCourt: 1,
            avoid: 1, // 是否申请回避
            debarbReason: '',//申请回避理由
            avoid_flag: true,
            agree: 1, //是否同意开庭,
            objection_open_flag: true,
            objection_open_Reason: '',//异议理由
            objection_open: 1, //对证据期限有无异议
            warrant: 1,
            objection: 1, //是否有异议 1: 无异议
            objectionReason: '', //有异议的理由
            objection_flag: true, //控制有理由显示input
            objection_no_controversy: 1, //无争议有异议
            no_controversy_isAdd: 1, //无争议补充
            objection_controversy: 1, //有争议有异议
            controversy_isAdd: 1, //有争议补充
            askedtoadd: 1, //是否交叉询问补充
            askedtoadd_flag: true, //控制有交叉补充显示INPUT
            askedtoaddReason: '',//需要询问或补充的内容
            peace:1,//是否愿意调解
            reconcile_flag: true,
            reconcileReason:"",//不愿调解理由
            info: '',
            name: '',
            type:'第三人代理'
        });
        }else{
          layer.msg('最多只能添加1位')
        }
          break;
        case '6':
          if(vm.personList.agentLegal.length < 2){
            vm.personList.agentLegal.push({
            show_flag: true,
            toCourt: 1,
            avoid: 1, // 是否申请回避
            debarbReason: '',//申请回避理由
            avoid_flag: true,
            agree: 1, //是否同意开庭,
            objection_open_flag: true,
            objection_open_Reason: '',//异议理由
            objection_open: 1, //对证据期限有无异议
            legalSelect: 1, // 法定代表下拉默认值
            objection: 1, //是否有异议 1: 无异议
            objectionReason: '', //有异议的理由
            objection_flag: true, //控制有理由显示input
            objection_no_controversy: 1, //无争议有异议
            no_controversy_isAdd: 1, //无争议补充
            objection_controversy: 1, //有争议有异议
            controversy_isAdd: 1, //有争议补充
            askedtoadd: 1, //是否交叉询问补充
            askedtoadd_flag: true, //控制有交叉补充显示INPUT
            askedtoaddReason: '',//需要询问或补充的内容
            peace:1,//是否愿意调解
            reconcile_flag: true,
            reconcileReason:"",//不愿调解理由
            legalShortA: "原",//当为法定代表人时选择对应简称
            info: '',
            name: '',
            type:'原告法定代表人'
        });
        }else{
          layer.msg('最多只能添加1位')
        }
          break;
        case '7':
          if(vm.personList.agentDefendantLegal.length < 2){
            vm.personList.agentDefendantLegal.push({
            show_flag: true,
            toCourt: 1,
            avoid: 1, // 是否申请回避
            debarbReason: '',//申请回避理由
            avoid_flag: true,
            agree: 1, //是否同意开庭,
            objection_open_flag: true,
            objection_open_Reason: '',//异议理由
            objection_open: 1, //对证据期限有无异议
            legalSelect: 1,
            objection: 1, //是否有异议 1: 无异议
            objectionReason: '', //有异议的理由
            objection_flag: true, //控制有理由显示input
            objection_no_controversy: 1, //无争议有异议
            no_controversy_isAdd: 1, //无争议补充
            objection_controversy: 1, //有争议有异议
            controversy_isAdd: 1, //有争议补充
            askedtoadd: 1, //是否交叉询问补充
            askedtoadd_flag: true, //控制有交叉补充显示INPUT
            askedtoaddReason: '',//需要询问或补充的内容
            peace:1,//是否愿意调解
            reconcile_flag: true,
            reconcileReason:"",//不愿调解理由
            legalShortB: "被",//当为法定代表人时选择对应简称
            info: '',
            name: '',
            type:'被告法定代表人'
        });
        }else{
          layer.msg('最多只能添加1位')
        }   
          break;
        case '8':
          if(vm.personList.agentThirdPeopleLegal.length < 2){
            vm.personList.agentThirdPeopleLegal.push({
            show_flag: true,
            toCourt: 1,
            avoid: 1, // 是否申请回避
            debarbReason: '',//申请回避理由
            avoid_flag: true,
            agree: 1, //是否同意开庭,
            objection_open_flag: true,
            objection_open_Reason: '',//异议理由
            objection_open: 1, //对证据期限有无异议
            legalSelect: 1,
            objection: 1, //是否有异议 1: 无异议
            objectionReason: '', //有异议的理由
            objection_flag: true, //控制有理由显示input
            objection_no_controversy: 1, //无争议有异议
            no_controversy_isAdd: 1, //无争议补充
            objection_controversy: 1, //有争议有异议
            controversy_isAdd: 1, //有争议补充
            askedtoadd: 1, //是否交叉询问补充
            askedtoadd_flag: true, //控制有交叉补充显示INPUT
            askedtoaddReason: '',//需要询问或补充的内容
            peace:1,//是否愿意调解
            reconcile_flag: true,
            reconcileReason:"",//不愿调解理由
            legalShortT: "第",//当为法定代表人时选择对应简称
            info: '',
            name: '',
            type:'第三人法定代表人'
        });
        }else{
          layer.msg('最多只能添加1位')
        }
          break;  
      }
    };
    //删除参与人
    vm.delBailor = function(type, index) {
      /** 
       * 0:原告、1:被告、2:第三人、3:原告代理、4:被告代理、5:第三人代理、6：原告法定代表、7：被告法定代表、8：第三人法定代表
       */
      switch (type) {
        case '0':
          if(vm.personList.accuserList.length > 1){
            vm.personList.accuserList.splice(index, 1);
          }else if(vm.personList.accuserList.length === 1){
            layer.open({
            content: '仅有最后一位，删除后无法恢复，确认删除？',
            yes: function(i, layero){
                vm.personList.accuserList.splice(index, 1);
                layer.close(i); 
                $scope.$digest();
              }
            });
          }
          break;
        case '1':
          if(vm.personList.defendantList.length > 1){
            vm.personList.defendantList.splice(index, 1);
          }else if(vm.personList.defendantList.length === 1){
            layer.open({
            content: '仅有最后一位，删除后无法恢复，确认删除？',
            yes: function(i, layero){
                vm.personList.defendantList.splice(index, 1);
                layer.close(i); 
                $scope.$digest();
              }
            });
          } 
          break;
        case '2':
          if(vm.personList.thirdPeopleList.length > 1){
            vm.personList.thirdPeopleList.splice(index, 1);
          }else if(vm.personList.thirdPeopleList.length === 1){
            layer.open({
            content: '仅有最后一位，删除后无法恢复，确认删除？',
            yes: function(i, layero){
                vm.personList.thirdPeopleList.splice(index, 1);
                vm.personList.agentThirdPeopleList.splice(index, 1);
                vm.personList.agentThirdPeopleLegal.splice(index, 1);
                showSeating();
                layer.close(i); 
                $scope.$digest();
              }
            });
          }
          break;
        case '3':
          if(vm.personList.agentAccuserList.length > 1){
            vm.personList.agentAccuserList.splice(index, 1);
          }else if(vm.personList.agentAccuserList.length === 1){
            layer.open({
            content: '仅有最后一位，删除后无法恢复，确认删除？',
            yes: function(i, layero){
                vm.personList.agentAccuserList.splice(index, 1);
                layer.close(i); 
                $scope.$digest();
              }
            });
          }
          break;
        case '4':
          if(vm.personList.agentDefendantList.length > 1){
            vm.personList.agentDefendantList.splice(index, 1);
          }else if (vm.personList.agentDefendantList.length === 1) {
            layer.open({
            content: '仅有最后一位，删除后无法恢复，确认删除？',
            yes: function(i, layero){
                vm.personList.agentDefendantList.splice(index, 1);
                layer.close(i); 
                $scope.$digest();
              }
            });
          }
          break;
        case '5':
          if(vm.personList.agentThirdPeopleList.length > 1){
            vm.personList.agentThirdPeopleList.splice(index, 1);
          }else if(vm.personList.agentThirdPeopleList.length === 1){
            layer.open({
            content: '仅有最后一位，删除后无法恢复，确认删除？',
            yes: function(i, layero){
                vm.personList.agentThirdPeopleList.splice(index, 1);
                layer.close(i); 
                $scope.$digest();
              }
            });
          }
          break;
        case '6':
          if(vm.personList.agentLegal.length > 1){
            vm.personList.agentLegal.splice(index, 1);
          } else if(vm.personList.agentLegal.length === 1){
            layer.open({
            content: '仅有最后一位，删除后无法恢复，确认删除？',
            yes: function(i, layero){
                vm.personList.agentLegal.splice(index, 1);
                layer.close(i); 
                $scope.$digest();
              }
            });
          }    
          break;
        case '7':
          if(vm.personList.agentDefendantLegal.length > 1){
            vm.personList.agentDefendantLegal.splice(index, 1);
          }else if(vm.personList.agentDefendantLegal.length === 1){
            layer.open({
            content: '仅有最后一位，删除后无法恢复，确认删除？',
            yes: function(i, layero){
                vm.personList.agentDefendantLegal.splice(index, 1);
                layer.close(i); 
                $scope.$digest();
              }
            });
          }
          break;
        case '8':
          if(vm.personList.agentThirdPeopleLegal.length > 1){
            vm.personList.agentThirdPeopleLegal.splice(index, 1);
          }else if(vm.personList.agentThirdPeopleLegal.length === 1){
            layer.open({
            content: '仅有最后一位，删除后无法恢复，确认删除？',
            yes: function(i, layero){
                vm.personList.agentThirdPeopleLegal.splice(index, 1);
                layer.close(i); 
                $scope.$digest();
              }
            });
          }
          break;
      }

    };
    /**
     * [showRecordTpl 生成笔录模板]
     * @param  {[Object]} list [模板数据]
     * @return {[type]}      [null]
     */
     vm.showRecordTpl = function(id) {
       $state.go("record.show", {
         list: id
       });
     }

    //点击保存
    vm.RecordSave = function(trialNumber) {
      $(".temporary").css({display:"inline-block"});
      getToCourt();
      getAbsentee();
      var arr = $('#findConclude').find('.gray'),proofData = '';
      function sort(arr){
      var temp;
      for(var i = 0; i < arr.length - 1 ; i++){  
            for(var j = i + 1; j < arr.length; j++){  
                if($(arr[i]).attr('title') > $(arr[j]).attr('title')){ 
                    var temp = arr[i];  
                    arr[i] = arr[j];  
                    arr[j] = temp;  
                }  
            }  
        }
        return arr;
      }
      var sortArray = sort(arr);
      for(var k = 0,llen = sortArray.length; k < llen; k++){
      proofData += $(sortArray[k]).text();
      }

      var record_content = [{
        "id": "trial_info",
        "name": "庭审信息",
        "content": $('#trial_info').length ? angular.element('#trial_info')[0].innerText : ""
      }, {
        "id": "court_discipline",
        "name": "法庭纪律",
        "content": $("#court_discipline").length ? angular.element('#court_discipline')[0].innerText : ""
      }, {
        "id": "check_info",
        "name": "信息核对",
        "content": "",
        "child": [{
          "id": "itigant_participant",
          "name": "诉讼参与人",
          "content": $("#itigant_participant").length ? angular.element('#itigant_participant')[0].innerText : ""
        }, {
          "id": "dissent_reason",
          "name": "异议及理由",
          "content": $("#dissent_reason").length ? angular.element('#dissent_reason')[0].innerText : ""
        }, {
          "id": "witness",
          "name": "是否有证人出庭",
          "content": $("#witness").length ? angular.element('#witness')[0].innerText : ""
        }, {
          "id": "absent_trial",
          "name": "缺席审理",
          "content": $("#absent_trial").length ? angular.element('#absent_trial')[0].innerText : ""
        }]
      }, {
        "id": "hearing_preface",
        "name": "庭审序言",
        "content": "",
        "child": [{
          "id": "trial_org",
          "name": "庭审组织",
          "content": $("#trial_org").length ? angular.element('#trial_org')[0].innerText: ""
        }, {
          "id": "litigation_rights",
          "name": "告知诉讼权利",
          "content": $("#litigation_rights").length ? angular.element('#litigation_rights')[0].innerText : ""
        }, {
          "id": "told_matters",
          "name": "告知事项",
          "content": $("#told_matters").length ? angular.element('#told_matters')[0].innerText : ""
        }, {
          "id": "withdrawal_petition",
          "name": "是否申请回避",
          "content": $("#withdrawal_petition").length ? angular.element('#withdrawal_petition')[0].innerText : ""
        }, {
          "id": "adducing_evidence_objection",
          "name": "举证期限异议",
          "content": $("#adducing_evidence_objection").length ? angular.element('#adducing_evidence_objection')[0].innerText : ""
        }]
      }, {
        "id": "court_investigation",
        "name": "法庭调查",
        "content": "",
        "child": [{
          "id": "the_plea_opinion",
          "name": "诉辩意见",
          "content": $('#the_plea_opinion').length ? angular.element('#the_plea_opinion')[0].innerText : ""
        }, {
          "id": "the_court_asked",
          "name": "法庭询问",
          "content": $('#the_court_asked').length ? angular.element('#the_court_asked')[0].innerText : ""
        }, {
          "id": "conclude_contest",
          "name": "归纳争点",
          "content": "",
          "child": [{
            "id": "no_contest_conclude",
            "name": "无争议归纳",
            "content": $('#no_contest_conclude').length ? angular.element('#no_contest_conclude')[0].innerText : ""
          }, {
            "id": "contest_conclude",
            "name": "争议归纳",
            "content": $('#contest_conclude').length ? angular.element('#contest_conclude')[0].innerText : ""
          }]
        }, {
          "id": "proof",
          "name": "举证质证",
          "content": $("#proof").length ? angular.element('#proof')[0].innerText : ""
        }, {
          "id": "research_summary",
          "name": "调查总结",
          "content": ""
        }]
      }, {
        "id": "court_debate",
        "name": "法庭辩论",
        "content": ($("court_debate").length ? angular.element('#court_debate')[0].innerText : ""),
        "child": [{
          "id": "court_debate_accuser",
          "name": "原告方辩论意见",
          "content": ""
        }, {
          "id": "court_debate_defendant",
          "name": "被告方辩论意见",
          "content": ""
        }, {
          "id": "court_debate_third_man",
          "name": "第三人辩论意见",
          "content": ""
        }]
      }, {
        "id": "final_statement",
        "name": "最后陈述",
        "content":$("#final_statement").length ? angular.element('#final_statement')[0].innerText : ""
      }, {
        "id": "court_mediation",
        "name": "法庭调解",
        "content": $("#court_mediation").length ? angular.element('#court_mediation')[0].innerText : ""
      }, {
        "id": "closed_court_read",
        "name": "休庭宣读",
        "content": $("closed_court_read").length ? angular.element('#closed_court_read')[0].innerText : ""
      }, {
        "id": "others",
        "name": "其他",
        "content": $("#others").length ? angular.element('#others')[0].innerText : ""
      }]
      var saveList = {
          record_title: vm.trialNumber,
          record_type: "section",
          hearing_procedure: vm.data.program,
          open_num: vm.trialNumber,
          case_no: vm.data.caseInfoList.case_no,
          court_name: vm.data.caseInfoList.court_name,
          court_open_date: now(vm.time.startDate),
          proof_affirm: proofData,
          no_contest_sum: $('#noControversy').text(),
          contest_sum: $('#Controversy').text(),
          opinion_accuser:($("#opinion_accuser").length ? angular.element('#opinion_accuser')[0].innerText : ""),
          opinion_defendant:($("#opinion_defendant").length ? angular.element('#opinion_defendant')[0].innerText : ""),
          opinion_third_man: ($("#opinion_third_man").length ? angular.element('#opinion_third_man')[0].innerText : ""),
          case_brief: vm.data.caseInfoList.case_brief,
          hear_open: vm.data.hear_open,
          accepted_date: vm.data.caseInfoList.accepted_date, 
          judge_info: ($("#judge_info").length ? angular.element('#judge_info')[0].innerText : ""),
          court_clerk: vm.data.judge_info.court_clerk,
          participant: ($("#itigant_participant").length ? angular.element('#itigant_participant')[0].innerText : ""),
          arrive_parties: JSON.stringify(vm.data.toCourtMan),
          accuser: creatName('accuserList'),
          defendant: creatName('defendantList'),
          third_man: creatName('thirdPeopleList'),
          record_content: JSON.stringify(record_content)
        }
        console.log(saveList)
        if(saveList.court_clerk.length){
          recordService.recordStore.save(saveList)
          .then(function(data) {
            if(data && data.status === 200){
              $(".temporary").css({display:"none"});
              if(data.config && data.config.data && data.config.data.record_title){
                var num = data.config.data.record_title;
                layer.open({
                  content: '笔录保存成功!',
                  yes: function(index, layero) {
                    getRcordList(num);
                    layer.close(index);
                  }
                });
              }  
            }else{
              layer.msg("笔录保存失败!");  
            }
          })
        }else{
          $(".temporary").css({display:"none"})
          layer.msg("请将信息补充完整~")
        } 
    }
    //将到庭人员信息保存
    function getToCourt() {
      var array = [];
      for (var i in vm.personList) {
        vm.personList[i].forEach(function(item) {
          if (item.toCourt === 1) {
            array.push({
              type: item.type,
              name: item.name
            }) 
          }
        });
      }
      vm.data.toCourtMan = array;
    }
    //将未到庭人员信息保存（诉讼地位名：姓名）
    function getAbsentee() {
      var array = [];
      for (var i in vm.personList) {
        vm.personList[i].forEach(function(item) {
          if(item.toCourt === 2) {
            array.push({
              type: item.type,
              name: item.name
            })           
          }
        })
      }
      vm.data.absentee = array;
    }
    //构造所有问题数据呈现在下拉框
    function creatAllQuestion(data){
      var selVal = [];
      data.forEach(function(item){
        selVal.push({
          value:item.ele_id,
          text:item.ele_name
        })
      });
      return selVal;
    }
    // 构造当事人可选问题呈现在下拉框
    function creatPartiesQuestion(data){
      var partiesQuestionArray = [],
          answerArray = [];
      data.forEach(function(item){
         partiesQuestionArray.push({
            value:item.ask_index,
            text:item.ask_info
         }); 
         answerArray.push({
            _id:item.ask_index,
            answerInfo:item.answer_info,
            askInfo:item.ask_info,
            summaryInfo:item.summary_info
         });
      });
      return {
        partiesQuestionArray:partiesQuestionArray,
        answerArray:answerArray
      };
    }
    //多个诉讼参与人名字分号隔开
    function creatName(str) {
      var newString = '';
      vm.personList[str].forEach(function(item, i) {
          if (i === 0) {
            newString = item.name
          } else {
            newString += ';'+item.name
          }     
      });
      return newString;
    }
    //获取笔录列表
    function getRcordList(num){
      recordService.recordList.get({
          case_no: $stateParams.case_no
        })
        .then(function(results) {
          var data = results.data;
          if (verify(data, 200)) {
            vm.caption = data
            recordService.setRecordData(data);
            vm.trialNumber = vm.caption.body.length + 1;//设置默认开庭次数
            if(num !== undefined){
              var _id = data.body[num - 1].record_id;
              $state.go("record.show", {
                list: _id
              });
            }
          }
        });
    }
    //模态框查看笔录
    vm.recordModel = {
      modal: {},
      openModal: function (params) {
        this.modal = $uibModal.open({
          templateUrl: "./partials/record/view.model.html",
          size: "lg",
          scope: $scope,
          keyboard: false,
          backdrop: 'static',
          windowClass: "modal-record",
        });
        this.getShowPage(params)
      },
      getShowPage: function (params) {
        var _data = recordService.getRecordData(params),
            _content = JSON.parse(_data.record_content),
            _array = [];
        vm.court_name = _data.court_name;
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
      },
      //关闭模态框
      closeModal: function () {
        this.modal.close();
      },
    }

    //休庭
    $("body").on("click", "p" ,function(){
      window.anchorIdx = $(this).index("p");
    })
    vm.adjourn = function() {
      $("#adjourn").css({display:"block"});
      adjourn();
    }
    var stack = [];
    function adjourn() {
      stack = [];
      var idxx = window.anchorIdx;
      if (idxx !== undefined) {
        var len = $("p").length;
        for (var i = idxx; i < len; i++) {
          var str = $("p").eq(i+1).html();
          stack.push(str);
          $("p").eq(i+1).empty()
        }
      }
    } 
    vm.cancel = function(){
      var idxx = window.anchorIdx;
      if(idxx !== undefined) {
        var len = $("p").length;
        var k = 0;
        for(var i = idxx; i < len; i++){
            if($("p").eq(i+1)[0] !== undefined){
              $("p").eq(i+1).html(stack[k]);
              $compile($('p'))($scope);
              k++;
            }
        }
      }
    }
   
    activate();

    function activate() {
      if($stateParams.verdict_flag == 1 && $stateParams.court_record_flag == 1){
        if(time){
          clearTimeout(time);
        }
        var time = setTimeout(function(){
          $("#save").attr("disabled", true); 
        },0) 
      }

      //获取案件列表页面传递过来的数据
      vm.data.caseInfoList = {
        case_no: $stateParams.case_no,
        case_brief: $stateParams.case_brief,
        court_name: $stateParams.court_name,
        accuser: $stateParams.accuser,
        accuser_baseinfo: $stateParams.accuser_baseinfo,
        defendant: $stateParams.defendant,
        defendant_baseinfo: $stateParams.defendant_baseinfo,
        third_man: $stateParams.third_man,
        third_man_baseinfo: $stateParams.third_man_baseinfo,
        hearing_procedure: $stateParams.hearing_procedure,
        accepted_date: $stateParams.accepted_date,
        verdict_flag: $stateParams.verdict_flag
      };
      //获取笔录列表
      getRcordList()
      //获取笔录左侧菜单树
      recordService.TreeList.get().then(function(results) {
        vm.tree_element = results.data.body[0].tree_element;
      });

      //获取全案要素表思路
      recordService.getElements.get({
        category: "民事案件",
        write_type: "section",
        case_brief: "民间借贷纠纷"
      }).then(function(results) {
        vm.data.all = creatAllQuestion(results.data.body);
      });
  
    }
  };
})();