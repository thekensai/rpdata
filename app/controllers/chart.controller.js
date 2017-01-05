module.exports = {
  showSuburbYtd: showSuburbYtd,
}

/**
 * Show all events
 */
function showSuburbYtd(req, res) {


  const https = require('https'),
  host = 'https://scs-sandbox-api.corelogic.asia',
  path = '/charts/v2/chart.png?chartSize=' 
    + req.params.height + 'x' + req.params.width 
    + '&fromDate=2016-01-01&toDate=2017-01-01&s1.lId=' 
    + req.params.suburb
    + '&s1.lTId=8&s1.pTId=' 
    + req.params.pType 
    + '&s1.mTId=21&access_token=' + global.access_token;

  var request = require('request');
  
  request(host + path, {encoding: null},
    function (err, response, body) {
  		//console.log('error', err);
  		if (response && response.headers['app_messages']) {
      		console.log('res', response.headers['app_messages'] ); //401
      		res.writeHead(404);
      		res.end();
  		}
      	else {
      		res.writeHead(200, {'Content-Type': 'image/png'});
      		res.end(body);
      	}
    });



//  res.redirect(host + path);

}
