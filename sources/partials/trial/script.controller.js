(function() {
  angular
    .module("app.trial")
    .controller("TrialController", TrialController);

  TrialController.$inject = [
    "$sce", "$scope", "$window", "$stateParams", "$anchorScroll", "$state", "serviceTrial", "DATA", "MAP", "$uibModal"
  ];

  function TrialController(
    $sce, $scope, $window, $stateParams, $anchorScroll, $state, serviceTrial, DATA, MAP, $uibModal
  ) {
    var vm = this;
    window.data = DATA;window.a = $stateParams;
    /** Case */
    vm.case = $stateParams;

    if(DATA.verify.personList.accuser[0].accuserList.length ){
      DATA.verify.personList.accuser[0].accuserList[0].name = $stateParams.accuser;
      DATA.verify.personList.accuser[0].accuserList[0].info = $stateParams.accuser_baseinfo;
    }

    if(DATA.verify.personList.defendant[0].defendantList.length){
      DATA.verify.personList.defendant[0].defendantList[0].name = $stateParams.defendant;
      DATA.verify.personList.defendant[0].defendantList[0].info = $stateParams.defendant_baseinfo;
    }
    
    if(DATA.verify.personList.third[0].thirdPeopleList.length){
      DATA.verify.personList.third[0].thirdPeopleList[0].name = $stateParams.third_man;
      DATA.verify.personList.third[0].thirdPeopleList[0].info = $stateParams.third_man_baseinfo;
    }
    
    DATA.info.caseReason = $stateParams.case_brief;
    DATA.info.caseNumber = $stateParams.case_no;
    DATA.info.courtName = $stateParams.court_name;

     /** article store */
    vm.article = {
      template: "",
      store: {
        map: MAP,
        data: DATA
      }
    };

    /** article event */
    vm.event = {
      // 庭审信息
      info: {
        //Date
        opened: {},
        open: function($event, elementOpened) {
            $event.preventDefault();
            $event.stopPropagation();
            vm.event.info.opened[elementOpened] = !vm.event.info.opened[elementOpened];
          },
          judgeShow: function(id) {
          if (id === 1) {
            vm.article.store.data.info.judge.duties_flag = true;
            vm.article.store.data.preface.prefaceOrganization.program = '普通程序'
          } else {
            vm.article.store.data.info.judge.duties_flag = false;
            vm.article.store.data.preface.prefaceOrganization.program = '简易程序'
          }
        },
        //姓名格式
        checkName: function(e){
         this.name = $(e.target).val();
        },
        setNameFormat: function(name,e){
          var regx = /^[\u4E00-\u9FA5A-Za-z\s]+$/;
          if (vm.article.store.data.info.judge[name].length === 2) {
            var value = vm.article.store.data.info.judge[name].replace(/\s+/g, '');
            var nameArr = [];
            nameArr[0] = value.substr(0, 1);
            value.substr(1, 2) ? nameArr[1] = value.substr(1, 2) : 0;
            vm.article.store.data.info.judge[name] = nameArr.join(' ');
          }
          if(!vm.article.store.data.info.judge[name]){
           // layer.msg('姓名不能为空')
          }else if(vm.article.store.data.info.judge[name].length >= 50){
            layer.msg('字符过长');
            vm.article.store.data.info.judge[name] = this.name;
          }else if(!regx.test(vm.article.store.data.info.judge[name])){
            layer.msg('姓名只能为汉字或英文');
            vm.article.store.data.info.judge[name] = this.name;
          }
        },
        setPersonFormat:function(parentName,name,parentIndex,index,e){
          var regx = /^[\u4E00-\u9FA5A-Za-z\s]+$/;
          if(!vm.article.store.data.verify.personList[parentName][parentIndex][name][index].name){
           // layer.msg('姓名不能为空')
          }else if(vm.article.store.data.verify.personList[parentName][parentIndex][name][index].name.length >= 50){
            layer.msg('字符过长');
            vm.article.store.data.verify.personList[parentName][parentIndex][name][index].name = this.name;
          }else if(!regx.test(vm.article.store.data.verify.personList[parentName][parentIndex][name][index].name)){
            layer.msg('姓名只能为汉字或英文');
            vm.article.store.data.verify.personList[parentName][parentIndex][name][index].name = this.name;
          }
        },
        setNumberFormat:function(name){
          var regx = /^\d{1,3}$/;
          if(!regx.test(vm.article.store.data.info[name])){
            layer.msg('请输入小于三位数的数字');
            vm.article.store.data.info[name] = this.number;
          }
        }
      },
      // 法庭纪律
      discipline: {},
      // 信息核对
      verify: {
        // 诉讼参与人
        verify_participant: {
          //添加诉讼参与人的点击事件
          addBailor: function(type, parentIndex, index) {
            /** 
             * 0:原告、1:被告、2:第三人、3:原告代理、4:被告代理、5:第三人代理
             */
            switch (type) {
              case '0':
                vm.article.store.data.verify.personList.accuser[parentIndex].accuserList.push({
                  hide_flag: true,
                  show_flag: true, //控制未到庭隐藏
                  toCourt: 1, // 默认到庭状态
                  avoid: 1, // 是否申请回避
                  debarbReason: '', //申请回避理由
                  avoid_flag: true,
                  agree: 1, //是否同意开庭,
                  objection_open_flag: true,
                  objection_open_Reason: '', //异议理由
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
                  askedtoaddReason: '', //需要询问或补充的内容
                  peace: 1, //是否愿意调解
                  reconcile_flag: true,
                  reconcileReason: "", //不愿调解理由
                  info: '', //原告人员信息
                  name: '', //原告姓名
                  type: '原告',
                  uuId: vm.event.verify.verify_participant.guid()
                });
                vm.event.verify.verify_participant.showSetting();
                vm.event.verify.verify_participant.getAbsentee();
                break;
              case '1':
                vm.article.store.data.verify.personList.defendant[parentIndex].defendantList.push({
                  hide_flag: true,
                  show_flag: true,
                  toCourt: 1,
                  avoid: 1, // 是否申请回避
                  debarbReason: '', //申请回避理由
                  avoid_flag: true,
                  agree: 1, //是否同意开庭,
                  objection_open_flag: true,
                  objection_open_Reason: '', //异议理由
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
                  askedtoaddReason: '', //需要询问或补充的内容
                  peace: 1, //是否愿意调解
                  reconcile_flag: true,
                  reconcileReason: "", //不愿调解理由
                  info: '',
                  name: '',
                  type: '被告',
                  uuId: vm.event.verify.verify_participant.guid()
                });
                vm.event.verify.verify_participant.showSetting();
                vm.event.verify.verify_participant.getAbsentee();
                break;
              case '2':
                vm.article.store.data.verify.personList.third[parentIndex].thirdPeopleList.push({
                  hide_flag: true,
                  show_flag: true,
                  toCourt: 1,
                  avoid: 1, // 是否申请回避
                  debarbReason: '', //申请回避理由
                  avoid_flag: true,
                  agree: 1, //是否同意开庭,
                  objection_open_flag: true,
                  objection_open_Reason: '', //异议理由
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
                  askedtoaddReason: '', //需要询问或补充的内容
                  peace: 1, //是否愿意调解
                  reconcile_flag: true,
                  reconcileReason: "", //不愿调解理由
                  info: '',
                  name: '',
                  type: '第三人',
                  uuId: vm.event.verify.verify_participant.guid()
                });
                vm.event.verify.verify_participant.showSetting();
                vm.event.verify.verify_participant.getAbsentee();
                break;
              case '3':
                if (vm.article.store.data.verify.personList.accuser[parentIndex].agentAccuserList.length < 2) {
                  vm.article.store.data.verify.personList.accuser[parentIndex].agentAccuserList.push({
                    hide_flag: true,
                    show_flag: true,
                    toCourt: 1,
                    avoid: 1, // 是否申请回避
                    debarbReason: '', //申请回避理由
                    avoid_flag: true,
                    agree: 1, //是否同意开庭,
                    objection_open_flag: true,
                    objection_open_Reason: '', //异议理由
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
                    askedtoaddReason: '', //需要询问或补充的内容
                    peace: 1, //是否愿意调解
                    reconcile_flag: true,
                    reconcileReason: "", //不愿调解理由
                    info: '',
                    name: '',
                    type: '原告代理',
                    uuId: vm.event.verify.verify_participant.guid()
                  });
                  vm.event.verify.verify_participant.showSetting();
                  vm.event.verify.verify_participant.getAbsentee();
                } else {
                  layer.msg('最多只能添加1位')
                }
                break;
              case '4':
                if (vm.article.store.data.verify.personList.defendant[parentIndex].agentDefendantList.length < 2) {
                  vm.article.store.data.verify.personList.defendant[parentIndex].agentDefendantList.push({
                    hide_flag: true,
                    show_flag: true,
                    toCourt: 1,
                    avoid: 1, // 是否申请回避
                    debarbReason: '', //申请回避理由
                    avoid_flag: true,
                    agree: 1, //是否同意开庭,
                    objection_open_flag: true,
                    objection_open_Reason: '', //异议理由
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
                    askedtoaddReason: '', //需要询问或补充的内容
                    peace: 1, //是否愿意调解
                    reconcile_flag: true,
                    reconcileReason: "", //不愿调解理由
                    warrant: 1,
                    info: '',
                    name: '',
                    type: '被告代理',
                    uuId: vm.event.verify.verify_participant.guid()
                  });
                  vm.event.verify.verify_participant.showSetting();
                  vm.event.verify.verify_participant.getAbsentee();
                } else {
                  layer.msg('最多只能添加1位')
                }
                break;
              case '5':
                if (vm.article.store.data.verify.personList.third[parentIndex].agentThirdPeopleList.length < 2) {
                  vm.article.store.data.verify.personList.third[parentIndex].agentThirdPeopleList.push({
                    hide_flag: true,
                    show_flag: true,
                    toCourt: 1,
                    avoid: 1, // 是否申请回避
                    debarbReason: '', //申请回避理由
                    avoid_flag: true,
                    agree: 1, //是否同意开庭,
                    objection_open_flag: true,
                    objection_open_Reason: '', //异议理由
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
                    askedtoaddReason: '', //需要询问或补充的内容
                    peace: 1, //是否愿意调解
                    reconcile_flag: true,
                    reconcileReason: "", //不愿调解理由
                    info: '',
                    name: '',
                    type: '第三人代理',
                    uuId: vm.event.verify.verify_participant.guid()
                  });
                  vm.event.verify.verify_participant.showSetting();
                  vm.event.verify.verify_participant.getAbsentee();
                } else {
                  layer.msg('最多只能添加1位')
                }
                break;
              case '6':
                if (vm.article.store.data.verify.personList.accuser[parentIndex].agentLegal.length < 2) {
                  vm.article.store.data.verify.personList.accuser[parentIndex].agentLegal.push({
                    hide_flag: true,
                    show_flag: true,
                    toCourt: 1,
                    avoid: 1, // 是否申请回避
                    debarbReason: '', //申请回避理由
                    avoid_flag: true,
                    agree: 1, //是否同意开庭,
                    objection_open_flag: true,
                    objection_open_Reason: '', //异议理由
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
                    askedtoaddReason: '', //需要询问或补充的内容
                    peace: 1, //是否愿意调解
                    reconcile_flag: true,
                    reconcileReason: "", //不愿调解理由
                    legalShortA: "原", //当为法定代表人时选择对应简称
                    info: '',
                    name: '',
                    type: '原告法定代表人',
                    uuId: vm.event.verify.verify_participant.guid()
                  });
                  vm.event.verify.verify_participant.showSetting();
                  vm.event.verify.verify_participant.getAbsentee();
                } else {
                  layer.msg('最多只能添加1位')
                }
                break;
              case '7':
                if (vm.article.store.data.verify.personList.defendant[parentIndex].agentDefendantLegal.length < 2) {
                  vm.article.store.data.verify.personList.defendant[parentIndex].agentDefendantLegal.push({
                    hide_flag: true,
                    show_flag: true,
                    toCourt: 1,
                    avoid: 1, // 是否申请回避
                    debarbReason: '', //申请回避理由
                    avoid_flag: true,
                    agree: 1, //是否同意开庭,
                    objection_open_flag: true,
                    objection_open_Reason: '', //异议理由
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
                    askedtoaddReason: '', //需要询问或补充的内容
                    peace: 1, //是否愿意调解
                    reconcile_flag: true,
                    reconcileReason: "", //不愿调解理由
                    legalShortB: "被", //当为法定代表人时选择对应简称
                    info: '',
                    name: '',
                    type: '被告法定代表人',
                    uuId: vm.event.verify.verify_participant.guid()
                  });
                  vm.event.verify.verify_participant.showSetting();
                  vm.event.verify.verify_participant.getAbsentee();
                } else {
                  layer.msg('最多只能添加1位')
                }
                break;
              case '8':
                if (vm.article.store.data.verify.personList.third[parentIndex].agentThirdPeopleLegal.length < 2) {
                  vm.article.store.data.verify.personList.third[parentIndex].agentThirdPeopleLegal.push({
                    hide_flag: true,
                    show_flag: true,
                    toCourt: 1,
                    avoid: 1, // 是否申请回避
                    debarbReason: '', //申请回避理由
                    avoid_flag: true,
                    agree: 1, //是否同意开庭,
                    objection_open_flag: true,
                    objection_open_Reason: '', //异议理由
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
                    askedtoaddReason: '', //需要询问或补充的内容
                    peace: 1, //是否愿意调解
                    reconcile_flag: true,
                    reconcileReason: "", //不愿调解理由
                    legalShortT: "第", //当为法定代表人时选择对应简称
                    info: '',
                    name: '',
                    type: '第三人法定代表人',
                    uuId: vm.event.verify.verify_participant.guid()
                  });
                  vm.event.verify.verify_participant.showSetting();
                  vm.event.verify.verify_participant.getAbsentee();
                } else {
                  layer.msg('最多只能添加1位')
                }
                break;
            }
          },
          //区块添加
          addTogether: function(type, index) {
            switch (type) {
              case 'accuser':
                vm.article.store.data.verify.personList.accuser.push({
                  //原告数据集合
                  hide_flag: true,
                  accuserList: [{
                    show_flag: true, //控制未到庭隐藏
                    toCourt: 1, // 默认到庭状态
                    avoid: 1, // 是否申请回避
                    debarbReason: '', //申请回避理由
                    avoid_flag: true,
                    agree: 1, //是否同意开庭,
                    objection_open_flag: true,
                    objection_open_Reason: '', //异议理由
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
                    askedtoaddReason: '', //需要询问或补充的内容
                    peace: 1, //是否愿意调解
                    reconcile_flag: true,
                    reconcileReason: "", //不愿调解理由
                    info: '', //原告人员信息
                    name: '', //原告姓名
                    type: '原告',
                    uuId: vm.event.verify.verify_participant.guid()
                  }],
                  //原告法定代表人
                  agentLegal: [{
                    show_flag: true,
                    toCourt: 1,
                    avoid: 1, // 是否申请回避
                    debarbReason: '', //申请回避理由
                    avoid_flag: true,
                    agree: 1, //是否同意开庭,
                    objection_open_flag: true,
                    objection_open_Reason: '', //异议理由
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
                    askedtoaddReason: '', //需要询问或补充的内容
                    peace: 1, //是否愿意调解
                    reconcile_flag: true,
                    reconcileReason: "", //不愿调解理由
                    legalShortA: "原", //当为法定代表人时选择对应简称
                    info: '',
                    name: '',
                    type: '原告法定代表人',
                    uuId: vm.event.verify.verify_participant.guid()
                  }],
                  //原告委托代理人数据集合
                  agentAccuserList: [{
                    show_flag: true,
                    toCourt: 1,
                    avoid: 1, // 是否申请回避
                    debarbReason: '', //申请回避理由
                    avoid_flag: true,
                    agree: 1, //是否同意开庭,
                    objection_open_flag: true,
                    objection_open_Reason: '', //异议理由
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
                    askedtoaddReason: '', //需要询问或补充的内容
                    peace: 1, //是否愿意调解
                    reconcile_flag: true,
                    reconcileReason: "", //不愿调解理由
                    info: '',
                    name: '',
                    type: '原告代理',
                    uuId: vm.event.verify.verify_participant.guid()
                  }]
                })
                vm.event.verify.verify_participant.showSetting();
                vm.event.verify.verify_participant.getAbsentee();
                break;
              case 'defendant':
                vm.article.store.data.verify.personList.defendant.push({
                  //被告数据集合
                  hide_flag: true,
                  defendantList: [{
                    show_flag: true,
                    toCourt: 1,
                    avoid: 1, // 是否申请回避
                    debarbReason: '', //申请回避理由
                    avoid_flag: true,
                    agree: 1, //是否同意开庭,
                    objection_open_flag: true,
                    objection_open_Reason: '', //异议理由
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
                    askedtoaddReason: '', //需要询问或补充的内容
                    peace: 1, //是否愿意调解
                    reconcile_flag: true,
                    reconcileReason: "", //不愿调解理由
                    info: '',
                    name: '',
                    type: '被告',
                    uuId: vm.event.verify.verify_participant.guid()
                  }],
                  //被告法定代表人
                  agentDefendantLegal: [{
                    show_flag: true,
                    toCourt: 1,
                    avoid: 1, // 是否申请回避
                    debarbReason: '', //申请回避理由
                    avoid_flag: true,
                    agree: 1, //是否同意开庭,
                    objection_open_flag: true,
                    objection_open_Reason: '', //异议理由
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
                    askedtoaddReason: '', //需要询问或补充的内容
                    peace: 1, //是否愿意调解
                    reconcile_flag: true,
                    reconcileReason: "", //不愿调解理由
                    legalShortB: "被", //当为法定代表人时选择对应简称
                    info: '',
                    name: '',
                    type: '被告法定代表人',
                    uuId: vm.event.verify.verify_participant.guid()
                  }],
                  //被告委托代理人数据集合
                  agentDefendantList: [{
                    show_flag: true,
                    toCourt: 1,
                    avoid: 1, // 是否申请回避
                    debarbReason: '', //申请回避理由
                    avoid_flag: true,
                    agree: 1, //是否同意开庭,
                    objection_open_flag: true,
                    objection_open_Reason: '', //异议理由
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
                    askedtoaddReason: '', //需要询问或补充的内容
                    peace: 1, //是否愿意调解
                    reconcile_flag: true,
                    reconcileReason: "", //不愿调解理由
                    warrant: 1,
                    info: '',
                    name: '',
                    type: '被告代理',
                    uuId: vm.event.verify.verify_participant.guid()
                  }]
                })
                vm.event.verify.verify_participant.showSetting();
                vm.event.verify.verify_participant.getAbsentee();
                break;
              case 'third':
                vm.article.store.data.verify.personList.third.push({
                  //第三人数据集合
                  hide_flag: true,
                  thirdPeopleList: [{
                    show_flag: true,
                    toCourt: 1,
                    avoid: 1, // 是否申请回避
                    debarbReason: '', //申请回避理由
                    avoid_flag: true,
                    agree: 1, //是否同意开庭,
                    objection_open_flag: true,
                    objection_open_Reason: '', //异议理由
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
                    askedtoaddReason: '', //需要询问或补充的内容
                    peace: 1, //是否愿意调解
                    reconcile_flag: true,
                    reconcileReason: "", //不愿调解理由
                    info: '',
                    name: '',
                    type: '第三人',
                    uuId: vm.event.verify.verify_participant.guid()
                  }],
                  //第三人法定代表人
                  agentThirdPeopleLegal: [{
                    show_flag: true,
                    toCourt: 1,
                    avoid: 1, // 是否申请回避
                    debarbReason: '', //申请回避理由
                    avoid_flag: true,
                    agree: 1, //是否同意开庭,
                    objection_open_flag: true,
                    objection_open_Reason: '', //异议理由
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
                    askedtoaddReason: '', //需要询问或补充的内容
                    peace: 1, //是否愿意调解
                    reconcile_flag: true,
                    reconcileReason: "", //不愿调解理由
                    legalShortT: "第", //当为法定代表人时选择对应简称
                    info: '',
                    name: '',
                    type: '第三人法定代表人',
                    uuId: vm.event.verify.verify_participant.guid()
                  }],
                  //第三人委托代理人数据集合
                  agentThirdPeopleList: [{
                    show_flag: true,
                    toCourt: 1,
                    avoid: 1, // 是否申请回避
                    debarbReason: '', //申请回避理由
                    avoid_flag: true,
                    agree: 1, //是否同意开庭,
                    objection_open_flag: true,
                    objection_open_Reason: '', //异议理由
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
                    askedtoaddReason: '', //需要询问或补充的内容
                    peace: 1, //是否愿意调解
                    reconcile_flag: true,
                    reconcileReason: "", //不愿调解理由
                    info: '',
                    name: '',
                    type: '第三人代理',
                    uuId: vm.event.verify.verify_participant.guid()
                  }]
                })
                vm.event.verify.verify_participant.showSetting();
                vm.event.verify.verify_participant.getAbsentee();
                break;
            }
          },
          //删除参与人
          delBailor: function(type, parentIndex, index) {
            /** 
             * 0:原告、1:被告、2:第三人、3:原告代理、4:被告代理、5:第三人代理、6：原告法定代表、7：被告法定代表、8：第三人法定代表
             */
            switch (type) {
              case '0':
                if (vm.article.store.data.verify.personList.accuser[parentIndex].accuserList.length > 1) {
                  vm.article.store.data.verify.personList.accuser[parentIndex].accuserList.splice(index, 1);
                } else if (vm.article.store.data.verify.personList.accuser[parentIndex].accuserList.length === 1) {
                  layer.open({
                    content: '仅有最后一位，删除后无法恢复，确认删除？',
                    yes: function(i, layero) {
                      vm.article.store.data.verify.personList.accuser[parentIndex].accuserList.splice(index, 1);
                      vm.event.verify.verify_participant.showSetting();
                      vm.event.verify.verify_participant.getAbsentee();
                      layer.close(i);
                      $scope.$digest();
                    }
                  });
                }
                break;
              case '1':
                if (vm.article.store.data.verify.personList.defendant[parentIndex].defendantList.length > 1) {
                  vm.article.store.data.verify.personList.defendant[parentIndex].defendantList.splice(index, 1);
                } else if (vm.article.store.data.verify.personList.defendant[parentIndex].defendantList.length === 1) {
                  layer.open({
                    content: '仅有最后一位，删除后无法恢复，确认删除？',
                    yes: function(i, layero) {
                      vm.article.store.data.verify.personList.defendant[parentIndex].defendantList.splice(index, 1);
                      vm.event.verify.verify_participant.showSetting();
                      vm.event.verify.verify_participant.getAbsentee();
                      layer.close(i);
                      $scope.$digest();
                    }
                  });
                }
                break;
              case '2':
                if (vm.article.store.data.verify.personList.third[parentIndex].thirdPeopleList.length > 1) {
                  vm.article.store.data.verify.personList.third[parentIndex].thirdPeopleList.splice(index, 1);
                } else if (vm.article.store.data.verify.personList.third[parentIndex].thirdPeopleList.length === 1) {
                  layer.open({
                    content: '仅有最后一位，删除后无法恢复，确认删除？',
                    yes: function(i, layero) {
                      vm.article.store.data.verify.personList.third[parentIndex].thirdPeopleList.splice(index, 1);
                      vm.article.store.data.verify.personList.third[parentIndex].agentThirdPeopleList.splice(index, 1);
                      vm.article.store.data.verify.personList.third[parentIndex].agentThirdPeopleLegal.splice(index, 1);
                      $("#third").css({border:"none"});
                      vm.event.verify.verify_participant.showSetting();
                      vm.event.verify.verify_participant.getAbsentee();
                      layer.close(i);
                      $scope.$digest();
                    }
                  });
                }
                break;
              case '3':
                if (vm.article.store.data.verify.personList.accuser[parentIndex].agentAccuserList.length > 1) {
                  vm.article.store.data.verify.personList.accuser[parentIndex].agentAccuserList.splice(index, 1);
                } else if (vm.article.store.data.verify.personList.accuser[parentIndex].agentAccuserList.length === 1) {
                  layer.open({
                    content: '仅有最后一位，删除后无法恢复，确认删除？',
                    yes: function(i, layero) {
                      vm.article.store.data.verify.personList.accuser[parentIndex].agentAccuserList.splice(index, 1);
                      vm.event.verify.verify_participant.showSetting();
                      vm.event.verify.verify_participant.getAbsentee();
                      layer.close(i);
                      $scope.$digest();
                    }
                  });
                }
                break;
              case '4':
                if (vm.article.store.data.verify.personList.defendant[parentIndex].agentDefendantList.length > 1) {
                  vm.article.store.data.verify.personList.defendant[parentIndex].agentDefendantList.splice(index, 1);
                } else if (vm.article.store.data.verify.personList.defendant[parentIndex].agentDefendantList.length === 1) {
                  layer.open({
                    content: '仅有最后一位，删除后无法恢复，确认删除？',
                    yes: function(i, layero) {
                      vm.article.store.data.verify.personList.defendant[parentIndex].agentDefendantList.splice(index, 1);
                      vm.event.verify.verify_participant.showSetting();
                      vm.event.verify.verify_participant.getAbsentee();
                      layer.close(i);
                      $scope.$digest();
                    }
                  });
                }
                break;
              case '5':
                if (vm.article.store.data.verify.personList.third[parentIndex].agentThirdPeopleList.length > 1) {
                  vm.article.store.data.verify.personList.third[parentIndex].agentThirdPeopleList.splice(index, 1);
                } else if (vm.article.store.data.verify.personList.third[parentIndex].agentThirdPeopleList.length === 1) {
                  layer.open({
                    content: '仅有最后一位，删除后无法恢复，确认删除？',
                    yes: function(i, layero) {
                      vm.article.store.data.verify.personList.third[parentIndex].agentThirdPeopleList.splice(index, 1);
                      vm.event.verify.verify_participant.showSetting();
                      vm.event.verify.verify_participant.getAbsentee();
                      layer.close(i);
                      $scope.$digest();
                    }
                  });
                }
                break;
              case '6':
                if (vm.article.store.data.verify.personList.accuser[parentIndex].agentLegal.length > 1) {
                  vm.article.store.data.verify.personList.accuser[parentIndex].agentLegal.splice(index, 1);
                } else if (vm.article.store.data.verify.personList.accuser[parentIndex].agentLegal.length === 1) {
                  layer.open({
                    content: '仅有最后一位，删除后无法恢复，确认删除？',
                    yes: function(i, layero) {
                      vm.article.store.data.verify.personList.accuser[parentIndex].agentLegal.splice(index, 1);
                      vm.event.verify.verify_participant.showSetting();
                      vm.event.verify.verify_participant.getAbsentee();
                      layer.close(i);
                      $scope.$digest();
                    }
                  });
                }
                break;
              case '7':
                if (vm.article.store.data.verify.personList.defendant[parentIndex].agentDefendantLegal.length > 1) {
                  vm.article.store.data.verify.personList.defendant[parentIndex].agentDefendantLegal.splice(index, 1);
                } else if (vm.article.store.data.verify.personList.defendant[parentIndex].agentDefendantLegal.length === 1) {
                  layer.open({
                    content: '仅有最后一位，删除后无法恢复，确认删除？',
                    yes: function(i, layero) {
                      vm.article.store.data.verify.personList.defendant[parentIndex].agentDefendantLegal.splice(index, 1);
                      vm.event.verify.verify_participant.showSetting();
                      vm.event.verify.verify_participant.getAbsentee();
                      layer.close(i);
                      $scope.$digest();
                    }
                  });
                }
                break;
              case '8':
                if (vm.article.store.data.verify.personList.third[parentIndex].agentThirdPeopleLegal.length > 1) {
                  vm.article.store.data.verify.personList.third[parentIndex].agentThirdPeopleLegal.splice(index, 1);
                } else if (vm.article.store.data.verify.personList.third[parentIndex].agentThirdPeopleLegal.length === 1) {
                  layer.open({
                    content: '仅有最后一位，删除后无法恢复，确认删除？',
                    yes: function(i, layero) {
                      vm.article.store.data.verify.personList.third[parentIndex].agentThirdPeopleLegal.splice(index, 1);
                      vm.event.verify.verify_participant.showSetting();
                      vm.event.verify.verify_participant.getAbsentee();
                      layer.close(i);
                      $scope.$digest();
                    }
                  });
                }
                break;
            }
          },
          //区块删除
          delTogether: function(type,index){
            if (vm.article.store.data.verify.personList[type].length > 1) {
              layer.open({
                content: '确认删除？',
                yes: function(i, layero) {
                  vm.article.store.data.verify.personList[type].splice(index, 1);
                  vm.event.verify.verify_participant.showSetting();
                  vm.event.verify.verify_participant.getAbsentee();
                  layer.close(i);
                  $scope.$digest();
                }
              });
            }else{
              layer.msg("至少有一位")
            }
          },
          //控制法定代表，代理，指定代理,负责人简称
          lagalAgentChange: function(obj) {
            switch (obj.legalSelect) {
              case 1:
                obj.legalShortA = "原";
                obj.legalShortB = "被";
                obj.legalShortT = "第";
                obj.type = "法定代表";
                break;
              case 2:
                obj.legalShortA = "原";
                obj.legalShortB = "被";
                obj.legalShortT = "第";
                obj.type = "负责人";
                break;
              case 3:
                obj.legalShortA = "法代";
                obj.legalShortB = "法代";
                obj.legalShortT = "法代";
                obj.type = "法定代理人";
                break;
              case 4:
                obj.legalShortA = "指代";
                obj.legalShortB = "指代";
                obj.legalShortT = "指代";
                obj.type = "指定代理人";
            }
            vm.event.verify.verify_participant.getAbsentee();
          },
          toCourtChange: function(obj) {
            obj.toCourt === 1 ? (obj.show_flag = true) : (obj.show_flag = false);
            vm.event.verify.verify_participant.showSetting();
            vm.event.verify.verify_participant.getAbsentee(); //存储未到庭人员 （诉讼地位名：姓名）
            vm.event.verify.verify_participant.lagalAgentChange(obj);
            // vm.event.verify.verify_participant.getToCourt(obj); //存储到庭人员 （诉讼地位名：姓名）
          },
          showSetting: function() {
            var allList = null,
              defendant = null,
              thirdPeop = null,
              tempArray_1, tempArray_2, tempArray_3;

            allList = vm.event.verify.verify_participant.concatArray().all;
            defendant = vm.event.verify.verify_participant.concatArray().defendantArray;
            thirdPeop = vm.event.verify.verify_participant.concatArray().thirdArray;

            //全部数据到庭情况  
            tempArray_1 = allList.filter(function(item) {
              return item.show_flag === true;
            });
            //被告到庭情况
            tempArray_2 = defendant.filter(function(item) {
              return item.show_flag === true;
            });
            //第三人到庭情况
            tempArray_3 = thirdPeop.filter(function(item) {
              return item.show_flag === true;
            });

            /**全部缺席和全部到庭 start**/
            if (tempArray_2.length && tempArray_3.length || tempArray_2.length && !thirdPeop.length) {
              vm.article.store.data.verify.attendance_flag = true;
            } else if (!tempArray_2.length && !tempArray_3.length) {
              vm.article.store.data.verify.attendance_flag = false
            }
            /** end **/

            /**部分缺席显示字段 start**/
            tempArray_2.length ? (vm.article.store.data.verify.defendant_part_flag = true) : (vm.article.store.data.verify.defendant_part_flag = false);
            tempArray_3.length ? (vm.article.store.data.verify.thirdPeop_part_flag = true) : (vm.article.store.data.verify.thirdPeop_part_flag = false);
            tempArray_3.length ? (vm.article.store.data.verify.third_man_flag = true) : (vm.article.store.data.verify.third_man_flag = false);

            if (!thirdPeop.length) {
              vm.article.store.data.verify.thirdPeop_part_flag = true
              vm.article.store.data.verify.third_man_flag = false
            }
            /** end **/
          },
          /**
           * [concatArray 构造全部数据]
           * @return {[type]} [全部数据]
           */
          concatArray: function() {
            var all = [],
              defendantArray = [],
              thirdArray = [];

            for (var i in vm.article.store.data.verify.personList) {
              if (vm.event.verify.verify_participant.isType(vm.article.store.data.verify.personList[i]) === 'Array') {
                vm.article.store.data.verify.personList[i].forEach(function(v) {
                  all = all.concat(vm.event.verify.verify_participant.for2Array(v));
                });
                if (i === 'defendant') {
                  vm.article.store.data.verify.personList[i].forEach(function(v) {
                    defendantArray = defendantArray.concat(vm.event.verify.verify_participant.for2Array(v));
                  });
                }
                if (i === 'third') {
                  vm.article.store.data.verify.personList[i].forEach(function(v) {
                    thirdArray = thirdArray.concat(vm.event.verify.verify_participant.for2Array(v));
                  });
                }
              }
            }
            return {
              all: all,
              defendantArray: defendantArray,
              thirdArray: thirdArray
            };
          },
          /**
           * [for2Array 构造全部数据]
           * @param  {[type]} data [每个类型的数据]
           * @return {[type]}      [description]
           */
          for2Array: function(data) {
            var tempArray = [];
            if (vm.event.verify.verify_participant.isType(data) === 'Object') {
              for (var i in data) {
                if (vm.event.verify.verify_participant.isType(data[i]) === 'Array') {
                  tempArray = tempArray.concat(data[i]);
                }
              }
            }
            return tempArray;
          },
          /**
           * [isType 类型判断]
           * @param  {[type]}  data [数据]
           * @return {Boolean}      [类型]
           */
          isType: function(data) {
            var type = Object.prototype.toString.call(data);
            switch (type) {
              case '[object Array]':
                return 'Array';
              case '[object Object]':
                return 'Object';
              case '[object String]':
                return 'String';
              case '[object Function]':
                return 'Function';
            }
          },
          //控制是否全部愿意调解显示框
          toMediate: function() {
            var array = [];
            for (var i in vm.article.store.data.verify.personList) {
              vm.article.store.data.verify.personList[i].forEach(function(item) {
                for (var j in item) {
                  if (vm.event.verify.verify_participant.isType(item[j]) === 'Array') {
                    item[j].forEach(function(v) {
                      if (v.peace === 2) {
                        array.push({
                          type: v.type,
                          name: v.name
                        });
                      }
                    });
                  }
                }
              });
            }
            vm.article.store.data.conciliation.toMediateMan = array;
            vm.article.store.data.conciliation.toMediateMan.length ? (vm.article.store.data.conciliation.toMediate_flag = false) : (vm.article.store.data.conciliation.toMediate_flag = true)
          },
          guid: function() {
            var result = "";
            for (var i = 1; i <= 32; i++) {
              var n = Math.floor(Math.random() * 16.0).toString(16);
              result += n;
              if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
                result += "-";
            }
            return result;
          },  
          //将未到庭人员信息保存（诉讼地位名：姓名）
          getAbsentee: function() {
            vm.article.store.data.verify.absentee = [];
            for (var i in vm.article.store.data.verify.personList) {
              vm.article.store.data.verify.personList[i].forEach(function(item) {
                for (var j in item) {
                  if (vm.event.verify.verify_participant.isType(item[j]) === 'Array') {
                    item[j].forEach(function(v) {
                      if (v.toCourt === 2) {
                        vm.article.store.data.verify.absentee.push({
                          uuId: v.uuId,
                          name: v.name,
                          type: v.type
                        });
                      }
                    });
                  }
                }
              })
            }
          },
           //将到庭人员信息保存
          getToCourt: function() {
            for (var i in vm.article.store.data.verify.personList) {
              vm.article.store.data.verify.personList[i].forEach(function(item) {
                for (var j in item) {
                  if (vm.event.verify.verify_participant.isType(item[j]) === 'Array') {
                    item[j].forEach(function(v) {
                      if (v.toCourt === 1) {
                        vm.article.store.data.verify.toCourtMan.push({
                          name: v.name,
                          type: v.type
                        });
                      }
                    });
                  }
                }
              });
            }
          },
          //多个诉讼参与人名字分号隔开
          creatName: function (str,str1) {
            var newString = '';
            vm.article.store.data.verify.personList[str].forEach(function(item) {
                for (var j in item) {
                  if(j === str1){
                    if (vm.event.verify.verify_participant.isType(item[j]) === 'Array') {
                      item[j].forEach(function(v,i) {
                        if(!newString){
                          newString = v.name;
                        }else{
                          newString += ';' + v.name;
                        }
                      });
                    }
                  }
                }
              });
            return newString;
          }
        },
        // 异议及理由
        verify_objection: {
          objectionChange: function(obj) {
            obj.objection === 1 ? (obj.objection_flag = true) : (obj.objection_flag = false); // 控制有无异议显示输入框
            obj.avoid === 1 ? (obj.avoid_flag = true) : (obj.avoid_flag = false); //申请回避显示输入框
            obj.objection_open === 1 ? (obj.objection_open_flag = true) : (obj.objection_open_flag = false); //控制出庭人员有无异议显示输入框
            obj.askedtoadd === 1 ? (obj.askedtoadd_flag = true) : (obj.askedtoadd_flag = false); // 控制交叉询问补充显示输入框
            obj.peace === 1 ? (obj.reconcile_flag = true) : (obj.reconcile_flag = false); //不愿意调解显示不愿意调解理由输入框
            vm.event.verify.verify_participant.toMediate();
          }
        },
        // 缺席审理
        verify_absence: {},
        // 是否有证人出庭
        verify_witness: {}
      },
      preface: {
        // 庭审组织
        preface_organization: {
          replacePerson: function(type) {
            switch (type) {
              case "ordinary":
                $('#change-ordinary').css({
                  display: "inline"
                });
                $('#ordinary-button').css({
                  display: "none"
                });
                break;
              case "simple":
                $('#change-simple').css({
                  display: "inline"
                });
                $('#simple-button').css({
                  display: "none"
                });
                break;
            }
          },
          ordinaryDelete: function(type) {
            switch (type) {
              case "ordinary":
                $('#change-ordinary').css({
                  display: "none"
                });
                $('#ordinary-button').css({
                  display: "inline"
                });
                break;
              case "simple":
                $('#change-simple').css({
                  display: "none"
                });
                $('#simple-button').css({
                  display: "inline"
                });
                break;
            }
          },
        },
        // 告知诉讼权利
        preface_right: {},
        // 告知事项
        preface_inform: {},
        // 是否申请回避
        preface_withdrawal: {},
        // 举证期限异议
        preface_time_limit: {}
      },
      // 法庭调查
      investigate: {
        // 诉辩意见
        investigate_opinion: {},
        // 法庭询问
        investigate_inquiry: {
          questionChange: function(data) {
            var _this = this;
            serviceTrial.getElementsById({
              ele_id: data
            }).then(function(results) {
              _this._data = vm.event.investigate.investigate_inquiry.creatPartiesQuestion(results.body);
              for (var i = 0; i < _this._data.answerArray.length; i++) {
                vm.article.store.data.investigate.investigate_inquiry.allQuestion.push(_this._data.answerArray[i])
              }
            })
          },
          //询问阶段删除问题
          delCurr: function(index) {
            vm.article.store.data.investigate.investigate_inquiry.allQuestion.splice(index, 1)
          },
          //构造所有问题数据呈现在下拉框
          creatAllQuestion: function(data) {
            var selVal = [];
            data.forEach(function(item) {
              selVal.push({
                value: item.ele_id,
                text: item.ele_name
              })
            });
            return selVal;
          },
          // 构造当事人可选问题呈现在下拉框
          creatPartiesQuestion: function(data) {
            var partiesQuestionArray = [],
              answerArray = [];
            data.forEach(function(item) {
              partiesQuestionArray.push({
                value: item.ask_index,
                text: item.ask_info
              });
              answerArray.push({
                _id: item.ask_index,
                answerInfo: item.answer_info,
                askInfo: item.ask_info,
                summaryInfo: item.summary_info
              });
            });
            return {
              answerArray: answerArray
            };
          }
        },
        // 归纳争点
        investigate_conclude: {
          // 无争议归纳
          investigate_conclude_without_dispute: {},
          // 争议归纳
          investigate_conclude_in_dispute: {}
        },
        // 举证质证
        investigate_evidence: {}
      },
      // 法庭辩论
      debate: {
        //辩论次数
        debate_times: {
          addTrial: function() {
            vm.article.store.data.debate.debateArray = [];
            vm.article.store.data.debate.debateTimes++;
            for (var i = 1, len = vm.article.store.data.debate.debateTimes; i < len; i++) {
              vm.article.store.data.debate.debateArray.push({
                count: i
              });
            }
          },
          //删除评论次数
          delDebate: function( index) {
            vm.article.store.data.debate.debateArray.splice(index, 1);
            vm.article.store.data.debate.debate--;
            layer.msg("删除成功~")
          }
        },
        // 原告方辩论意见
        debate_accuser: {},
        // 被告方辩论意见
        debate_defendant: {},
        // 第三人辩论意见
        debate_third: {}
      },
      // 最后陈述
      statement: {},
      // 法庭调解
      conciliation: {},
      // 休庭宣读
      announce: {},
      // 其他
      other: {
        //模态框查看笔录
        recordModel: {
          modal: {},
          openModal: function(params) {
            this.modal = $uibModal.open({
              templateUrl: "./partials/trial/view.model.html",
              size: "lg",
              scope: $scope,
              keyboard: false,
              backdrop: 'static',
              windowClass: "modal-trial",
            });
            this.getShowPage(params)
          },
          getShowPage: function(params) {
            serviceTrial.get({
              record_id: params
            }).then(function(result) {
              var content = JSON.parse(result.body[0].record_content),
                array = [];
              vm.court_name = result.body[0].court_name;
              dataConversion(content)

              function dataConversion(array) {
                array.forEach(function(item) {
                  array.push({
                    id: item.id,
                    value: item.content.replace(/\n/g, "<br/>")
                  });
                  if ('child' in item && item.child.length) {
                    dataConversion(item.child);
                  }
                });
                vm.info = array;
              }
            })
          },
          //关闭模态框
          closeModal: function() {
            this.modal.close();
          },
        }
      }
    };
    vm.event.verify.verify_participant.showSetting();
    /** Http */
    vm.http = {
      delete: function(recordID) {
        serviceTrial.delete({
            record_id: recordID,
          })
          .then(function(result) {
            vm.http.list = result.body;
            layer.msg(result.head.message);
          })
          .then(function() {
            vm.http.getList();
          })
          .then(function() {
            $state.go("trial");
          })
      },
      refresh: function() {
        this.getList().then(function() {
          layer.msg("庭审笔录列表刷新成功！");
        });
      },
      // just for right list
      list: [],
      getList: function() {
        return serviceTrial.getList({
            case_no: vm.case.case_no
          })
          .then(function(result) {
            vm.http.list = result.body;
            //设置默认开庭次数
            vm.article.store.data.info.conrtTimes = result.body.length + 1;
          })
      },
      // 获取全案要素表9个思路
      getListByElement: function() {
        serviceTrial.getListByElement({
          category: "民事案件",
          write_type: "section",
          case_brief: "民间借贷纠纷"
        }).then(function(results) {
          vm.article.store.data.investigate.investigate_inquiry.all = vm.event.investigate.investigate_inquiry.creatAllQuestion(results.body);
        });
      }
    };

    /** Operation */
    vm.operation = {
      anchor: function(id) {
        angular.element("#" + id).focus();
        $anchorScroll(id);
      },
    };

    /** Include */
    vm.include = {
      menu: "./partials/trial/view.menu.html",
      editor: "./partials/trial/view.editor.html",
      list: "./partials/trial/view.list.html"
    };

    // Init
    function activate() {
      var now = function() {
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var day = now.getDate();
        var currentDate = year + '-' + month + '-' + day;
        return (currentDate);
      }
      vm.article.store.data.info.time.start = new Date(now());
      vm.http.getList();
      vm.http.getListByElement();
      // reducer which handle event
      $scope.$on("wiserv-trial-get-list", function(event, data) {
        vm.http.getList();
      });
      $scope.$on("wiserv-trial-request-article", function(event, data) {
        $scope.$broadcast("wiserv-trial-response-article", vm.article.store);
      });
      $scope.$on("wiserv-trial-update-article", function(event, data) {
        vm.article.store = eval("(" + data.articleStore + ")");
        vm.article.template = data.articleTemplate;
      });
      $scope.$on("wiserv-trial-empty-article", function(event, data) {
        vm.article.store = {
          map: angular.copy(MAP),
          data: angular.copy(DATA)
        };
        vm.article.template = "";
      });
    };

    activate();
  };
})();