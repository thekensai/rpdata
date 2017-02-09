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

    		showPropertyList(res, req.params.suburb, json["_embedded"]["propertySummaryList"]);
    	}
    });

  },

  showSalesAround: (req, res) => {
	///bsg-au/v1/property/17771794.json?returnFields=coordinate
	//{{search}}/search/au/property/geo/radius/lastSale?radius=1&lat=-28.008176&lon=153.428172&beds=2-4&pTypes=HOUSE&price=500000-700000&sort=beds,desc&sort=price,asc&page=0&size=5
		const https = require('https'),
	  host_prop = 'https://property-sandbox-api.corelogic.asia',
	  path_prop = '/bsg-au/v1/property/' + req.params.pId + '.json?returnFields=coordinate'
	  host_search = 'https://search-sandbox-api.corelogic.asia',
	  path_search = '/search/au/property/geo/radius/lastSale?radius=10&sort=price,asc&page=0&size=5';

	  var request = require('request');
	  console.log(req.params);

	  request({
	    headers: {
	      'Authorization': 'Bearer '  + global.access_token,
	      'Content-Type': 'application/json'
	    },
	    uri: host_prop + path_prop,
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

	    		var coord = json.property.coordinate;
	    		var type = json.property.propertyType;
	
				request({
					    headers: {
					      'Authorization': 'Bearer '  + global.access_token,
					      'Content-Type': 'application/json'
					    },
					    uri: host_search + path_search
					    + '&lat=' + coord.latitude + '&lon=' + coord.longitude + '&Types=' + type,
					    method: 'GET'
					  }, function (err_inner, response_inner, body_inner) {
					  	if (err)
			            {
			              res.status(500);
			              return;
			            }
			            
			            if (response && response.headers['app_messages']) {
				      		//console.log(req.params);
				          	console.log(response.headers['app_messages'] ); 
				      		res.writeHead(500);
				      		res.end();
				      		return;
				  		}

						var json = JSON.parse(body_inner);

			            res.render('pages/sales', {layout: false, data: json["_embedded"]["propertySummaryList"].map(
				          s => s.propertySummary
				        )});
					  });
	    		
	        }
	    });
	}
};

function showPropertyList(res, suburb, list) {
	var db = require.main.require('./db.js');  
    db.localities.findOneByLId(suburb, function(err, locality) {
        if (err)
        {
          res.status(500);
          return;
        }
        
        res.render('pages/sales', {layout: false, data: list.map(
          s => {
            var summary = s.propertySummary;
            summary.address.singleLineAddress = [summary.address.singleLineAddress.substring(0, summary.address.singleLineAddress.length - locality.locality.length + 1), locality.locality];
            return summary;
          }
        )});
    });
};