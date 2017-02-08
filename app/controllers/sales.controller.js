module.exports = {

  // show the home page
  showSales: (req, res) => {

	const https = require('https'),
  host = 'https://search-sandbox-api.corelogic.asia',
  path = '/search/au/property/locality/' 
  + req.params.suburb
  + '/lastSale?&pTypes='
  + (req.params.pType == 0 ? 'HOUSE' : 'UNIT')
  + '&sort=price,asc&page=0&size=5';
//22677

  var request = require('request');
  console.log(req.params);
  console.log('sales path:', path);

  request({
    headers: {
      'Authorization': 'Bearer '  + global.access_token,
      'Content-Type': 'application/json'
    },
    uri: host + path,
    method: 'GET'
  }, function (err, response, body) {
  		//console.log('error', err);
  		if (response && response.headers['app_messages']) {
      		//console.log(req.params);
          console.log(response.headers['app_messages'] ); 
      		res.writeHead(500);
      		res.end();
  		}
    	else {
    		var json = JSON.parse(body);

        var db = require.main.require('./db.js');  
        db.localities.findOneByLId(req.params.suburb, function(err, locality) {
            if (err)
            {
              res.status(500);
              return;
            }
            
            res.render('pages/sales', {layout: false, data: json["_embedded"]["propertySummaryList"].map(
              s => {
                var summary = s.propertySummary;
                summary.address.singleLineAddress = [summary.address.singleLineAddress.substring(0, summary.address.singleLineAddress.length - locality.locality.length + 1), locality.locality];
                return summary;
              }
            )});
          });
    	}
    });

  }
};