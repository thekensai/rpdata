module.exports = {

	showProperty: (req, res) => {
	///bsg-au/v1/property/17771794.json?returnFields=coordinate
	//{{search}}/search/au/property/geo/radius/lastSale?radius=1&lat=-28.008176&lon=153.428172&beds=2-4&pTypes=HOUSE&price=500000-700000&sort=beds,desc&sort=price,asc&page=0&size=5
		const https = require('https'),
	  host_prop = 'https://property-sandbox-api.corelogic.asia',
	  path_prop = '/bsg-au/v1/property/' + req.params.pId + '.json?returnFields=address,attributes,coordinate,site,parcelList,saleList,avmDetailList,propertyPhotoList'
	  host_search = 'https://search-sandbox-api.corelogic.asia',
	  path_search = '/search/au/property/geo/radius/lastSale?radius=10&sort=price,asc&page=0&size=6';

	  var request = require('request');
	  ///console.log(req.params);


	 /* var pProperty = new Promise((resolve, reject) => {
		  request({
		    headers: {
		      'Authorization': 'Bearer '  + global.access_token,
		      'Content-Type': 'application/json'
		    },
		    uri: host_prop + path_prop,
		    method: 'GET'
		  }, function (err, response, body) {
		  		if (err) {
		  			console.log(err);
		  			reject(err);
		  			return;
		  		}

		  		if (response && response.headers['app_messages']) {
	      		//console.log(req.params);
		          console.log(response.headers['app_messages'] ); 
		          reject(response.headers['app_messages']);
		          return;
		  		}

		  		var json = JSON.parse(body);
		  		resolve(json.property);
		  });
		}); 

	var pSales = new Promise((resolve, reject) => {
		  request({
		    headers: {
		      'Authorization': 'Bearer '  + global.access_token,
		      'Content-Type': 'application/json'
		    },
		    uri: host_search + path_search
					    + '&lat=' + coord.latitude + '&lon=' + coord.longitude + '&Types=' + type,
		    method: 'GET'
		  }, function (err, response, body) {
		  		if (err) {
		  			console.log(err);
		  			reject(err);
		  			return;
		  		}

		  		if (response && response.headers['app_messages']) {
	      		//console.log(req.params);
		          console.log(response.headers['app_messages'] ); 
		          reject(response.headers['app_messages']);
		          return;
		  		}

		  		var json = JSON.parse(body);
		  		
		  });
		}); */


	  request({
	    headers: {
	      'Authorization': 'Bearer '  + global.access_token,
	      'Content-Type': 'application/json'
	    },
	    uri: host_prop + path_prop,
	    method: 'GET'
	  }, function (err, response, body) {
	  		  		//console.log('response', response);return;
	  		if (err) {
	      		//console.log(req.params);
	          console.log('error ', err ); 
	      		res.writeHead(500);
	      		res.end();
	  		}
	  		else if (response && response.headers['app_messages']) {
	      		//console.log(req.params);
	          console.log('error calling api', response.headers['app_messages'] ); 
	      		res.writeHead(500);
	      		res.end();
	  		}
	    	else {
	    		var json = JSON.parse(body);
// "message": "Invalid token provided."
//console.log('josn is', JSON.stringify(json, null, 2));
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

						var json_inner = JSON.parse(body_inner);
						var response = {
							propertySummaryList : json_inner["_embedded"]["propertySummaryList"].slice(1, 6).map(
				          s => s.propertySummary
				        )};

						var prop = json.property;

				        response.address = prop.address;
				        response.attributes = prop.attributes;
				        response.parcelList = prop.parcelList;
				        response.propertyType = prop.propertyType;
				        response.propertyPhotoList = prop.propertyPhotoList.slice(0, 3);
				        response.site = prop.site;

				        if (prop.saleList && prop.saleList.length) {
				        	response.lastSaleDetail = prop.saleList[0];
				        }

				        if (prop.avmDetailList && prop.avmDetailList.length) {
				        	response.avmDetail = prop.avmDetailList[0];
				        }

				        if (prop.parcelList && prop.parcelList.length) {
				        	response.parcel = prop.parcelList[0];
				        }

				        response.defaultPhoto = prop.propertyPhotoList.find(p => p.isDefaultPhoto);
				        if (!response.defaultPhoto) response.defaultPhoto = prop.propertyPhotoList[0];

				       /// console.log('response is', JSON.stringify(response, null, 2));

			            res.render('pages/property', {layout: false, data: response});
					  });
	    		
	        }
	    });
	}
};