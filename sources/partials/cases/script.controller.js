(function () {

  angular
    .module("app.cases")
    .controller("CasesController", CasesController);

  CasesController.$inject = [
    "casesService",
    "$rootScope",
    "verify",
    "$uibModal",
    "$scope",
    "uibDateParser",
    "$state"
  ];

  function CasesController(
    casesService,
    $rootScope,
    verify,
    $uibModal,
    $scope,
    uibDateParser,
    $state
  ) {
    var vm = this;
    // Case
    vm.case = {
      getCaseList: function (params) {
        var p = {
          current: vm.pagination.currentPageNumber,
          pageSize: vm.pagination.itemsPerPage
        }
        if (params) {
          p = _.assign({}, p, params)
        }
        vm.promise_getCaseList = casesService.cases.get(p)
          .then(function (data) {
            if (verify(data, 200)) {
              vm.list = data.body;
              if (data.body.length < 1) {
                layer.msg("没有找到你要搜索的内容", {
                  time: 2000,
                  icon: 5
                })
              }
              var itemsTotal = data.head.total;
              var itemsPerPage = vm.pagination.itemsPerPage;
              var pagesTotal = (itemsTotal % itemsPerPage == 0) ? (itemsTotal / itemsPerPage) : Math.floor(itemsTotal / itemsPerPage) + 1;
              vm.pagesTotal = pagesTotal;
              vm.itemsTotal = itemsTotal;
            } else {
              layer.msg(data.head.message, {
                time: 2000,
                icon: 5
              })
            }
          })
      },
      modal: {},
      caseInfo: {
        trial_term: 30,
        case_brief: "民间借贷纠纷",
      }, //修改案件渲染数据
      dateOptions: {
        format: 'yyyy-MM-dd',
        maxDate: new Date(),
        minDate: new Date(1900),
        startingDay: 1,
      }, //日期插件参数
      popup2: {
        opened: false
      }, //日期插件参数
      open2: function () {
        this.popup2.opened = true;
      }, //日期插件参数
      flag: false, //false 表示新增；true 表示修改，修改案件的案号不能修改
      openModal: function (caseInfo) {
        this.modal = $uibModal.open({
          templateUrl: "./partials/cases/view.modal.html",
          size: "md",
          scope: $scope,
          keyboard: false,
          backdrop: 'static',
          windowClass: "modal-case modal-default",
        });
        if (!$.isEmptyObject(caseInfo)) {

          this.caseInfo = caseInfo;
          //转换成日期插件需要的日期格式：sting to object
          this.caseInfo.accepted_date = uibDateParser.parse(this.caseInfo.accepted_date, "yyyy-MM-dd", this.caseInfo.accepted_date)
          this.flag = true
        } else {
          this.caseInfo = {
            trial_term: 30,
            case_brief: "民间借贷纠纷",
          };
          this.flag = false;
        }
      },
      validNumber: false, //案号验证的标志
      //案号验证的方法
      checkValue: function (val) {
        if (/[\(\)]+/.test(val)) {
          this.validNumber = true
        } else if (!/[\(\)]+/.test(val)) {
          this.validNumber = false
        }
      },
      //删除案件
      delete: function (case_no, court_record_flag) {
        if (court_record_flag == '0') {
          casesService.cases.delete(case_no)
            .then(function (data) {
              if (verify(data, 200)) {
                sessionStorage.removeItem(case_no);//如果此案件有模板，则删除模板
                layer.msg(data.head.message, {
                  time: 2000,
                  icon: 6
                })
                vm.case.getCaseList()
              } else {
                layer.msg(data.head.message, {
                  time: 2000,
                  icon: 5
                })
              }
            })
        } else {
          layer.msg('该案件已有庭审笔录，不能删除!')
        }
      },
      //保存或者修改案件
      saveModal: function (valid, caseInfo) {
        console.log(valid, caseInfo)
        if (valid) {
          this.modal.close();
          var hearing_procedure = "";
          //normal 普通程序(180)， simple 简易程序(90、30), 30对应小额诉讼
          if (caseInfo.trial_term == 30 || caseInfo.trial_term == 90) {
            hearing_procedure = "simple";
          } else if (caseInfo.trial_term == 180) {
            hearing_procedure = "normal";
          }
          var caseInfoValid = {
            accuser: caseInfo.accuser,
            defendant: caseInfo.defendant,
            case_no: caseInfo.case_no,
            case_brief: caseInfo.case_brief,
            trial_term: caseInfo.trial_term,
            accepted_date: moment(caseInfo.accepted_date, true).format("YYYY-MM-DD"),
            category: '民事案件',
            doc_type: '民事判决书',
            court_name: '四川省成都市武侯区人民法院',
            hearing_procedure: hearing_procedure
          }
          console.log(JSON.stringify(caseInfoValid), this.flag)
            //保存案件
          if (!this.flag) {
            casesService.cases.add(JSON.stringify(caseInfoValid))
              .then(function (data) {
                if (verify(data, 200)) {
                  layer.msg(data.head.message, {
                    time: 2000,
                    icon: 6
                  })
                  vm.case.getCaseList()
                } else {
                  layer.msg(data.head.message, {
                    time: 2000,
                    icon: 5
                  })
                }
              })
          } else {
            //修改案件
            casesService.cases.update(JSON.stringify(caseInfoValid))
              .then(function (data) {
                if (verify(data, 200)) {
                  layer.msg(data.head.message, {
                    time: 2000,
                    icon: 6
                  })
                  vm.case.getCaseList()
                } else {
                  layer.msg(data.head.message, {
                    time: 2000,
                    icon: 5
                  })
                }
              })
          }
        }
      },
      //关闭模态框
      closeModal: function () {
        this.modal.close();
        $state.go("cases", {}, {
          reload: true
        });
      },
      //搜索列表
      searchParams: {
        closure_flag: 0
      },
      searchCases: function (searchParams) {
        console.log(searchParams);
        vm.case.getCaseList(searchParams)
      },
      writerOperation: function (caseObj, write_type, operation) {
        //如果 sessionStorage 的article 存在 且是当前案号的内容，询问是否引用sessionStorage 的article 模板，还是请求后台新建份模板
        var temple = JSON.parse(sessionStorage.getItem(caseObj.case_no));
        //operation :1 表示新建文书，2表示查看文书，3表示修改文书，4表示重新生成文书
        if (operation == 1) { //表示新建文书操作
          if (temple) {
            layer.confirm('当前案号对应有历史编辑文书，打开，还是新建文书，如果打开请选择确认,否则取消？', {
              btn: ['确认', '取消'] //按钮
            }, function (index) {
              $state.go("judge", {
                istemple: 1,
                operation: 'REDO',
                title: caseObj.title,
                case_no: caseObj.case_no,
                category: caseObj.category,
                doc_type: caseObj.doc_type,
                write_type: write_type,
                hearing_procedure: caseObj.hearing_procedure,
                case_brief: caseObj.case_brief,
                court_name: caseObj.court_name,
                accuser: caseObj.accuser,
                accuser_baseinfo: caseObj.accuser_baseinfo,
                defendant: caseObj.defendant,
                defendant_baseinfo: caseObj.defendant_baseinfo,
                third_man: caseObj.third_man,
                third_man_baseinfo: caseObj.third_man_baseinfo,
                accepted_date: caseObj.accepted_date,
                closure_flag: caseObj.closure_flag,
                creater: caseObj.creater
              })
              layer.close(index);
            }, function (index) {
              $state.go("judge", {
                istemple: 0,
                operation: 'REDO',
                title: caseObj.title,
                case_no: caseObj.case_no,
                category: caseObj.category,
                doc_type: caseObj.doc_type,
                write_type: write_type,
                hearing_procedure: caseObj.hearing_procedure,
                case_brief: caseObj.case_brief,
                court_name: caseObj.court_name,
                accuser: caseObj.accuser,
                accuser_baseinfo: caseObj.accuser_baseinfo,
                defendant: caseObj.defendant,
                defendant_baseinfo: caseObj.defendant_baseinfo,
                third_man: caseObj.third_man,
                third_man_baseinfo: caseObj.third_man_baseinfo,
                accepted_date: caseObj.accepted_date,
                closure_flag: caseObj.closure_flag,
                creater: caseObj.creater
              })
              layer.close(index);
            })
          } else {
            layer.confirm('第一次访问裁判文书时，请先选择右侧“理由”才能进行文书正文操作', {
              btn: ['确认', '取消'] //按钮
            }, function (index) {
              $state.go("judge", {
                istemple: 0,
                operation: 'REDO',
                title: caseObj.title,
                case_no: caseObj.case_no,
                category: caseObj.category,
                doc_type: caseObj.doc_type,
                write_type: write_type,
                hearing_procedure: caseObj.hearing_procedure,
                case_brief: caseObj.case_brief,
                court_name: caseObj.court_name,
                accuser: caseObj.accuser,
                accuser_baseinfo: caseObj.accuser_baseinfo,
                defendant: caseObj.defendant,
                defendant_baseinfo: caseObj.defendant_baseinfo,
                third_man: caseObj.third_man,
                third_man_baseinfo: caseObj.third_man_baseinfo,
                accepted_date: caseObj.accepted_date,
                closure_flag: caseObj.closure_flag,
                creater: caseObj.creater
              })
              layer.close(index);
            }, function () {

            })

          }
        } else if (operation == 3) { //3表示修改文书操作
          if (temple) {
            layer.confirm('当前案号对应有历史编辑文书，打开，还是新建文书，如果打开请选择确认,否则取消？', {
              btn: ['确认', '取消'] //按钮
            }, function (index) {
              $state.go("judge", {
                istemple: 1,
                operation: 'UPDATE',
                title: caseObj.title,
                case_no: caseObj.case_no,
                category: caseObj.category,
                doc_type: caseObj.doc_type,
                write_type: write_type,
                hearing_procedure: caseObj.hearing_procedure,
                case_brief: caseObj.case_brief,
                court_name: caseObj.court_name,
                accuser: caseObj.accuser,
                accuser_baseinfo: caseObj.accuser_baseinfo,
                defendant: caseObj.defendant,
                defendant_baseinfo: caseObj.defendant_baseinfo,
                third_man: caseObj.third_man,
                third_man_baseinfo: caseObj.third_man_baseinfo,
                accepted_date: caseObj.accepted_date,
                closure_flag: caseObj.closure_flag,
                creater: caseObj.creater
              })
              layer.close(index);
            }, function (index) {
              $state.go("judge", {
                istemple: 0,
                operation: 'UPDATE',
                title: caseObj.title,
                case_no: caseObj.case_no,
                category: caseObj.category,
                doc_type: caseObj.doc_type,
                write_type: write_type,
                hearing_procedure: caseObj.hearing_procedure,
                case_brief: caseObj.case_brief,
                court_name: caseObj.court_name,
                accuser: caseObj.accuser,
                accuser_baseinfo: caseObj.accuser_baseinfo,
                defendant: caseObj.defendant,
                defendant_baseinfo: caseObj.defendant_baseinfo,
                third_man: caseObj.third_man,
                third_man_baseinfo: caseObj.third_man_baseinfo,
                accepted_date: caseObj.accepted_date,
                closure_flag: caseObj.closure_flag,
                creater: caseObj.creater
              })
              layer.close(index);
            })
          } else {
            $state.go("judge", {
              istemple: 0,
              operation: 'UPDATE',
              title: caseObj.title,
              case_no: caseObj.case_no,
              category: caseObj.category,
              doc_type: caseObj.doc_type,
              write_type: write_type,
              hearing_procedure: caseObj.hearing_procedure,
              case_brief: caseObj.case_brief,
              court_name: caseObj.court_name,
              accuser: caseObj.accuser,
              accuser_baseinfo: caseObj.accuser_baseinfo,
              defendant: caseObj.defendant,
              defendant_baseinfo: caseObj.defendant_baseinfo,
              third_man: caseObj.third_man,
              third_man_baseinfo: caseObj.third_man_baseinfo,
              accepted_date: caseObj.accepted_date,
              closure_flag: caseObj.closure_flag,
              creater: caseObj.creater
            })
          }
        } else if (operation == 4) { //4表示重新生成文书操作
          layer.confirm('您确认要重新生成文书吗？', {
            btn: ['确认', '取消'] //按钮
          }, function (index_1) {
            layer.confirm('当前案号对应有历史编辑文书，打开，还是新建文书，如果打开请选择确认,否则取消？', {
              btn: ['确认', '取消'] //按钮
            }, function (index_2) {
              $state.go("judge", {
                istemple: 1,
                operation: 'REDO',
                title: caseObj.title,
                case_no: caseObj.case_no,
                category: caseObj.category,
                doc_type: caseObj.doc_type,
                write_type: write_type,
                hearing_procedure: caseObj.hearing_procedure,
                case_brief: caseObj.case_brief,
                court_name: caseObj.court_name,
                accuser: caseObj.accuser,
                accuser_baseinfo: caseObj.accuser_baseinfo,
                defendant: caseObj.defendant,
                defendant_baseinfo: caseObj.defendant_baseinfo,
                third_man: caseObj.third_man,
                third_man_baseinfo: caseObj.third_man_baseinfo,
                accepted_date: caseObj.accepted_date,
                closure_flag: caseObj.closure_flag,
                creater: caseObj.creater
              })
              layer.close(index_2);
            }, function (index_2) {
              $state.go("judge", {
                istemple: 0,
                operation: 'REDO',
                title: caseObj.title,
                case_no: caseObj.case_no,
                category: caseObj.category,
                doc_type: caseObj.doc_type,
                write_type: write_type,
                hearing_procedure: caseObj.hearing_procedure,
                case_brief: caseObj.case_brief,
                court_name: caseObj.court_name,
                accuser: caseObj.accuser,
                accuser_baseinfo: caseObj.accuser_baseinfo,
                defendant: caseObj.defendant,
                defendant_baseinfo: caseObj.defendant_baseinfo,
                third_man: caseObj.third_man,
                third_man_baseinfo: caseObj.third_man_baseinfo,
                accepted_date: caseObj.accepted_date,
                closure_flag: caseObj.closure_flag,
                creater: caseObj.creater
              })
              layer.close(index_2);
            })
            layer.close(index_1);
          }, function (index_1) {
            layer.close(index_1);
          });
        }
      }
    };
    // Pagination
    vm.pagination = {
      maxSize: 5,
      currentPageNumber: 1, //当前第几页
      itemsPerPage: 5, //每页多少条
      pageParam: {
        current: this.currentPageNumber,
        pageSize: this.itemsPerPage,
      },
      change: function (data) {
        vm.case.getCaseList(vm.case.searchParams)
      },
    };
    //案件舆情caseOpinion
    vm.caseOpinion = {
      modal: {},
      openModal: function (case_brief) {
        this.modal = $uibModal.open({
          templateUrl: "./partials/cases/view.opinion.html",
          size: "lg",
          scope: $scope,
          keyboard: false,
          backdrop: 'static',
          windowClass: "modal-opinion modal-info",
        });
        this.getOpinionsList(case_brief);
      },
      getOpinionsList: function (case_brief) {
        vm.promise = casesService.opinion.get({
            case_brief: case_brief
          })
          .then(function (data) {
            if (verify(data, 200)) {
              vm.opinions = data.body;
            }
          })
      },
      getOpinionsFind: function (i, row_key) {
        vm.promise = casesService.opinion.find({
            row_key: row_key
          })
          .then(function (data) {
            if (verify(data, 200)) {
              data.body[0].content = data.body[0].content.replace(/\n/g, "<br/>");
              vm.opinions[i].articles = data.body;
            }
          })
      },
      //关闭模态框
      closeModal: function () {
        this.modal.close();
      },
    };
    vm.writer = {
      modal: {},
      openModal: function (params, verdict_flag, court_record_flag) {
        if (verdict_flag && court_record_flag == '1') {
          console.log(params)
          this.modal = $uibModal.open({
            templateUrl: "./partials/cases/view.writer.html",
            size: "lg",
            scope: $scope,
            keyboard: false,
            backdrop: 'static',
            windowClass: "modal-writer ",
          });
          this.getWriter(params)
        } else {
          layer.msg("操作失败，请先编辑庭审笔录以及新建文书，方可查看文书！")
        }
      },
      getWriter: function (params) {
        vm.promise_getWriter = casesService.writer.get(params)
          .then(function (data) {
            if (verify(data, 200)) {
              vm.writer.article = JSON.parse(data.body[0].json_content);
              console.log(JSON.parse(data.body[0].json_content))
            }
          })

      },

      //关闭模态框
      closeModal: function () {
        this.modal.close();
      },
    };
    // Init
    activate();

    function activate() {
      vm.case.getCaseList();
    }

  };

})();