(function () {
  angular.module("app.trial").
  constant("MAP", {
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
        text: '法定代表人'
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
      }, {
        value: 2,
        text: '增加诉请而需要新的举证期限'
      }, {
        value: 3,
        text: '需要法庭调查取证'
      }, {
        value: 4,
        text: '申请回避'
      }, {
        value: 5,
        text: '对举证期限有异议'
      }, {
        value: 6,
        text: '申请评估鉴定'
      }]
    }
  });
})();