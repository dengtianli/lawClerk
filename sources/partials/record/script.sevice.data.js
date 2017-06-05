  (function() {
    angular
      .module("app.record")
      .factory("serviceRecordData", serviceRecordData);

    serviceRecordData.$inject = ["$stateParams"];

    function serviceRecordData($stateParams) {
      var data = {
        _selectConditionMap: {
          statuses: {
            options: [{
              value: 1,
              text: '公开'
            }, {
              value: 2,
              text: '不公开'
            }]
          },
          duties: {
            options: [{
              value: 1,
              text: '审 判 长'
            }, {
              value: 2,
              text: '审 判 员'
            }, {
              value: 3,
              text: '代理审判员'
            }]
          },
          agents: {
            options: [{
              value: 1,
              text: '审 判 员'
            }, {
              value: 2,
              text: '代理审判员'
            }, {
              value: 3,
              text: '人民陪审员'
            }]
          },
          attendance: {
            options: [{
              value: 1,
              text: '到庭'
            }, {
              value: 2,
              text: '未到庭'
            }]
          },
          Authorization: {
            options: [{
              value: 1,
              text: '特别授权'
            }, {
              value: 2,
              text: '一般代理'
            }]
          },
          objection: {
            options: [{
              value: 1,
              text: '无异议'
            }, {
              value: 2,
              text: '有异议'
            }]
          },
          debarb: {
            options: [{
              value: 1,
              text: "不申请"
            }, {
              value: 2,
              text: "申请"
            }]
          },
          agree: {
            options: [{
              value: 1,
              text: '同意'
            }, {
              value: 2,
              text: '不同意'
            }]
          },
          need: {
            options: [{
              value: 1,
              text: '无'
            }, {
              value: 2,
              text: '有'
            }]
          },
          replenish: {
            options: [{
              value: 1,
              text: '无补充'
            }, {
              value: 2,
              text: '有补充'
            }]
          },
          reconcile: {
            options: [{
              value: 1,
              text: '愿意'
            }, {
              value: 2,
              text: '不愿意'
            }]
          },
          legal: {
            options: [{
              value: 1,
              text: '法定代表'
            },{
              value: 2,
              text: '负责人'
            },{
              value: 3,
              text: '法定代理人'
            }, {
              value: 4,
              text: '指定代理人'
            }]
          },
          adjourn: {
            options: [{
              value: 1,
              text: '变更诉请'
            },{
              value: 2,
              text: '增加诉请而需要新的举证期限'
            },{
              value: 3,
              text: '需要法庭调查取证'
            },{
              value: 4,
              text: '申请回避'
            },{
              value: 5,
              text: '对举证期限有异议'
            },{
              value: 6,
              text: '申请评估鉴定'
            }]
          }
        },
        personList: {
          //原告数据集合
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
            type: '原告'
          }],
          //被告数据集合
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
            type: '被告'
          }],
          //第三人数据集合
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
            name:'',
            type: '第三人'
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
            type: '原告代理'
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
            type: '被告代理'
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
            type: '第三人代理'
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
            type: '原告法定代表人'
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
            type: '被告法定代表人'
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
            type: '第三人法定代表人'
          }]
        },
        data: {
          adjourn: '',
          hear_open: '公开',
          person: '', //人数
          court_clerk: '', //书记员姓名
          adjournReason: 1,//休庭事由
          judge_info: { // 保存审判人员署名
            dutiesStatus: 1,
            agent: 1,
            jurors: 1,
            judgeName: '', //审判员姓名
            judgeName_second: '', //审判员姓名
            judgeName_third: '', //审判员姓名
            court_clerk: ''
          },
          courtnumber: '',
          program: '普通程序',
          caseInfoList: {},
          noControversy: '', //无争议事实内容
          Controversy: '', //争议事实内容
          absentee: '', //缺席人员数据
          toCourtMan: '', //到庭人员数据
          toMediateMan: '', //不愿意调解人员数据
          question: '', //选择问题
          all: [], // 所有问题
          allQuestion: [] //所有回答的问题
            // checkQuestion:'',//当事人选择的问题
            // partiesQuestion:[],//当事人可选问题
            // answerData:[],//当事人问题和回答内容 
        },
        accuserList:{
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
            info: $stateParams.accuser_baseinfo, //原告人员信息
            name: $stateParams.accuser, //原告姓名
            type:'原告'
        },
        defendantList:{
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
            name: '11111',
            type:'被告'
        },
        thirdPeopleList:{
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
            name: '1111111',
            type:'第三人'
        },
        agentAccuserList:{
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
        },
        agentDefendantList:{
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
        },
        agentThirdPeopleList:{
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
        },
        agentLegal:{
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
        },
        agentDefendantLegal:{
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
        },
        agentThirdPeopleLegal:{
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
        },
        setPerson:function(key,name,info){
          if(this.personList[key].length){
            this.personList[key][0].name = name;
            this.personList[key][0].info = info; 
          }
        }
      }
      return data;
    };
  })();