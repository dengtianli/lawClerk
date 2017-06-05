const Router = require('express').Router(),
      Util = require('../common/util.js');
/** Router definition */
Router.route('/trial_record/list')
  .get(function(request, response) {
    response.json(Util.json('/record/data/trial_record.json'));
});

/** Module export */
module.exports = Router;
