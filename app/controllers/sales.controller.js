module.exports = {

  // show the home page
  showSales: (req, res) => {

	//console.log(text);

	const https = require('https'),
  host = 'https://search-sandbox-api.corelogic.asia',
  path = '/search/au/property/geo/radius/lastSale?radius=100&lat=-28.008176&lon=153.428172&beds=2-4&pTypes=HOUSE&price=500000-700000&sort=beds,desc&sort=price,asc&page=0&size=5';

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
      		console.log(req.params);
          console.log(response.headers['app_messages'] ); 
      		res.writeHead(404);
      		res.end();
  		}
      	else {
      		//console.log(response);
      		//console.log(body);
      		//res.writeHead(200, {'Content-Type': 'image/png'});
      		res.send(response);
      	}
    });

  }
};