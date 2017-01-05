// create a new express router
const express      = require('express'),
  router           = express.Router(),
  mainController   = require('./controllers/main.controller'),
  chartController = require('./controllers/chart.controller');

// export router
module.exports = router;

// define routes
// main routes
router.get('/', mainController.showHome);

router.get('/chart/:suburb/:width/:height', chartController.showSuburbYtd);
