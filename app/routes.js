// create a new express router
const express      = require('express'),
  router           = express.Router(),
  mainController   = require('./controllers/main.controller'),
  chartController = require('./controllers/chart.controller');
  salesController = require('./controllers/sales.controller');

// export router
module.exports = router;

// define routes
// main routes
router.get('/', mainController.showHome);
router.get('/sales', salesController.showSales);

router.get('/chart/:suburb/:pType/:width/:height', chartController.showSuburbYtd);
