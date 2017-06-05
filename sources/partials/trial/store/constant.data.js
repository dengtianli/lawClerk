(function () {
  angular.module("app.trial").
  constant("DATA", {
    // 庭审信息
    info: {
      time: {
        start: "",
        end: "2017-03-19"
      },
      courtName: "", //法院名称
      courtNumber: "", //法庭编号
      conrtTimes: "", //开庭次数
      caseNumber: "", //案号
      caseReason: "", //案由
      open: "公开", //是否公开
      peopleOfNumber: "0" ,//人数
      judge: {
        judgeFirst: 1, //审判人员职务
        judgeSecond: 1,
        judgeThird: 1,
        firstName: "", //审判员姓名
        secondName_second: "", //审判员姓名
        thirdName_third: "", //审判员姓名
        duties_flag: true,
        clerkName: "" ,//书记员
      }, 
    },
    // 法庭纪律
    discipline: {},
    // 信息核对
    verify: {
      personList: {
        accuser: [{
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
            type: '原告',
            uuId:'123aaa345'
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
            uuId:'asdfg123'
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
            uuId:'1122dddddasd'
          }]
        }],
        defendant: [{
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
            type: '被告',
             uuId:'ddswwe2323'
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
            uuId:'ddswwe2ddddd'
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
            uuId:'dafdsaf223555'
          }]
        }],
        third: [{
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
            name: '',
            type: '第三人',
              uuId:'aajajjajjaja'
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
              uuId:'dafdsaf223555ssssee'
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
              uuId:'dafdsaf223555das2222234'
          }]
        }]
      },
      // objection_flag: true,
      attendance_flag: true,
      defendant_part_flag: true,
      thirdPeop_part_flag: true,
      third_man_flag: true,
      absentee: [], //缺席人员数据
      toCourtMan: [], //到庭人员数据
    },
    // 庭审序言
    preface: {
      prefaceOrganization: {
        program: "普通程序" //审理程序 （普通/简易）
      }
    },
    // 法庭调查
    investigate: {
      investigateConclude: {
        investigateConcludeWithoutDispute: "", //无争议归纳
        investigateConcludeInDispute: "" //争议归纳
      },
      investigate_inquiry: {
        question: '', //选择问题
        all: [], // 所有问题
        allQuestion: [] //所有回答的问题
      }
    },
    // 法庭辩论
    debate: {
        debateTimes: 2 ,
        reconcile_flag: true 
    },
    // 最后陈述
    statement: {},
    // 法庭调解
    conciliation: {
        toMediate_flag: true,
        toMediateMan: '' //不愿意调解人员数据
    },
    // 休庭宣读
    announce: {
      adjournment: 1
    },
    // 其他
    other: {},
  });
})();