(function () {
  angular
    .module("app.trial")
    .controller("TrialUpdateController", TrialUpdateController);

  TrialUpdateController.$inject = [
    "$sce",
    "$scope",
    "$window",
    "$stateParams",
    "$state",
    "trialUpdateService",
    "DATA",
    "MAP"
  ];

  function TrialUpdateController(
    $sce,
    $scope,
    $window,
    $stateParams,
    $state,
    trialUpdateService,
    DATA,
    MAP
  ) {
    var vm = this;

    /** Case */
    vm.case = $stateParams;

    /** Init */
    function activate() {
      console.log(vm)
      console.log($scope)
      vm.http.query();

    };

    /** Http */
    vm.http = {
      update: function (recordID) {
        $scope.$on("wiserv-trial-response-article", function (event, data) {
          
          var articleStore = JSON.stringify(data);
          //date
          var now = function() {
            var now = new Date();
            var year = now.getFullYear();
            var month = now.getMonth() + 1;
            var day = now.getDate();
            var currentDate = year + '-' + month + '-' + day;
            return (currentDate);
          }
          //将临时用于取文本的span标签隐藏
          $(".temporary").css({
            display: "inline-block"
          });
          // getToCourt();
          // getAbsentee();
          //询问阶段归纳总结排序对应到裁判文书
          var arr = $('#findConclude').find('.gray'),
            proofData = '';
          function sort(arr) {
            var temp;
            for (var i = 0; i < arr.length - 1; i++) {
              for (var j = i + 1; j < arr.length; j++) {
                if ($(arr[i]).attr('title') > $(arr[j]).attr('title')) {
                  var temp = arr[i];
                  arr[i] = arr[j];
                  arr[j] = temp;
                }
              }
            }
            return arr;
          }
          var sortArray = sort(arr);
          for (var k = 0, llen = sortArray.length; k < llen; k++) {
            proofData += $(sortArray[k]).text();
          }
           var record_content = [{
            "id": "trial_info",
            "name": "庭审信息",
            "content": $('#info').length ? angular.element('#info')[0].innerText : ""
          }, {
            "id": "court_discipline",
            "name": "法庭纪律",
            "content": $("#discipline").length ? angular.element('#discipline')[0].innerText : ""
          }, {
            "id": "check_info",
            "name": "信息核对",
            "content": ($("#verify").length ? angular.element('#verify')[0].innerText : ""),
            "child": [{
              "id": "itigant_participant",
              "name": "诉讼参与人",
              "content": ""
            }, {
              "id": "dissent_reason",
              "name": "异议及理由",
              "content": ""
            }, {
              "id": "witness",
              "name": "是否有证人出庭",
              "content": ""
            }, {
              "id": "verify_absence",
              "name": "缺席审理",
              "content": ""
            }]
          }, {
            "id": "hearing_preface",
            "name": "庭审序言",
            "content": ($("#preface").length ? angular.element('#preface')[0].innerText : ""),
            "child": [{
              "id": "trial_org",
              "name": "庭审组织",
              "content": ""
            }, {
              "id": "litigation_rights",
              "name": "告知诉讼权利",
              "content": ""
            }, {
              "id": "told_matters",
              "name": "告知事项",
              "content": ""
            }, {
              "id": "withdrawal_petition",
              "name": "是否申请回避",
              "content": ""
            }, {
              "id": "adducing_evidence_objection",
              "name": "举证期限异议",
              "content": ""
            }]
          }, {
            "id": "court_investigation",
            "name": "法庭调查",
            "content": ($('#investigate').length ? angular.element('#investigate')[0].innerText : ""),
            "child": [{
              "id": "the_plea_opinion",
              "name": "诉辩意见",
              "content": ""
            }, {
              "id": "the_court_asked",
              "name": "法庭询问",
              "content":  ""
            }, {
              "id": "conclude_contest",
              "name": "归纳争点",
              "content": "",
              "child": [{
                "id": "no_contest_conclude",
                "name": "无争议归纳",
                "content": ""
              }, {
                "id": "contest_conclude",
                "name": "争议归纳",
                "content": ""
              }]
            }, {
              "id": "proof",
              "name": "举证质证",
              "content": ""
            }, {
              "id": "research_summary",
              "name": "调查总结",
              "content": ""
            }]
          }, {
            "id": "court_debate",
            "name": "法庭辩论",
            "content": ($("#debate").length ? angular.element('#debate')[0].innerText : ""),
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
            "content": $("#statement").length ? angular.element('#statement')[0].innerText : ""
          }, {
            "id": "court_mediation",
            "name": "法庭调解",
            "content": $("#conciliation").length ? angular.element('#conciliation')[0].innerText : ""
          }, {
            "id": "closed_court_read",
            "name": "休庭宣读",
            "content": $("#announce").length ? angular.element('#announce')[0].innerText : ""
          }, {
            "id": "others",
            "name": "其他",
            "content": $("#other").length ? angular.element('#other')[0].innerText : ""
          }]
          
          angular.element("article.trial .hide_flag").remove();
          //将临时用于取文本的span标签隐藏
          $(".temporary").css({
            display: "none"
          });
          var articleTemplate = angular.element("article.trial>div").html();
          //将临时用于取文本的span标签隐藏
          $(".temporary").css({
            display: "inline-block"
          });
          trialUpdateService.update({
              record_title: "",
              record_type: "section",
              hearing_procedure: data.data.preface.prefaceOrganization.program,
              open_num: data.data.info.conrtTimes,
              case_no: data.data.info.caseNumber,
              court_name: data.data.info.courtName,
              court_open_date:now(data.data.info.time.start),
              proof_affirm: proofData,
              no_contest_sum: data.data.investigate.investigateConclude.investigateConcludeWithoutDispute,
              contest_sum: data.data.investigate.investigateConclude.investigateConcludeInDispute,
              opinion_accuser:($("#opinion_accuser").length ? angular.element('#opinion_accuser')[0].innerText : ""),
              opinion_defendant: ($("#opinion_defendant").length ? angular.element('#opinion_defendant')[0].innerText : ""),
              opinion_third_man: ($("#opinion_third_man").length ? angular.element('#opinion_third_man')[0].innerText : ""),
              case_brief: data.data.info.caseReason,
              hear_open: data.data.info.open,
              accepted_date: vm.case.accepted_date,
              judge_info: ($("#judge_info").length ? angular.element('#judge_info')[0].innerText : ""),
              court_clerk: data.data.info.judge.clerkName,
              participant: ($("#verify_participant").length ? angular.element('#verify_participant')[0].innerText : ""),
              arrive_parties: JSON.stringify(data.data.verify.toCourtMan),
              accuser:  $scope.$parent.Trial.event.verify.verify_participant.creatName("accuser",'accuserList'),
              defendant: $scope.$parent.Trial.event.verify.verify_participant.creatName("defendant",'defendantList'),
              third_man: $scope.$parent.Trial.event.verify.verify_participant.creatName("third",'thirdPeopleList'),
              record_content: JSON.stringify(record_content),
              record_id: vm.case.record_id,
              record_html: articleTemplate || "",
              record_js_status: articleStore || "{}",
            })
            .then(function (result) {
              layer.msg(result.head.message); 
              $window.location.reload();
            });
        });
        $scope.$emit("wiserv-trial-request-article");
      },
      query: function () {
        $scope.$emit("wiserv-trial-empty-article");
        trialUpdateService.query({
            record_id: vm.case.record_id
          })
          .then(function (result) {
            $scope.$emit("wiserv-trial-update-article", {
              articleTemplate: result.body[0].record_html,
              articleStore: result.body[0].record_js_status
            })
          });
      },
    };

    activate();
  };
})();