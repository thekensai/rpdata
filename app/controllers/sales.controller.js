module.exports = {

  // show the home page
  showSales: (req, res) => {

	//console.log(text);

	const https = require('https'),
  host = 'https://search-sandbox-api.corelogic.asia',
  path = '/search/au/property/locality/22677/lastSale?&pTypes=HOUSE&sort=price,asc&page=0&size=5';


  var request = require('request');
  //console.log(global.access_token);
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
          //res.send(json["_embedded"]["propertySummaryList"]);

      		res.render('pages/sales', {layout: false, data: json["_embedded"]["propertySummaryList"].map(s => s.propertySummary)});
      	}
    });

  }
};