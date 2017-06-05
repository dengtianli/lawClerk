const Router = require('express').Router(),
      Util = require('../common/util.js');

/**
 * http://localhost:5008/#!/layout/judgment/cases
 */
Router.route('/legal_case/list')
  .get(function(request, response) {
    response.json(Util.json('/cases/datas/legal-case-list.json'));
});

module.exports = Router;
