// create a new express router
const express      = require('express'),
  router           = express.Router(),
  mainController   = require('./controllers/main.controller'),
  chartController = require('./controllers/chart.controller'),
  salesController = require('./controllers/sales.controller');
  propertyController = require('./controllers/property.controller');

// export router
module.exports = router;

// define routes
// main routes
router.get('/', mainController.showHome);

router.get('/sales/:suburb/:pType', salesController.showSales);
router.get('/property/:pId', propertyController.showProperty);

router.get('/chart/:suburb/:pType/:width/:height', chartController.showSuburbYtd);
