module.exports = {

  // show the home page
  showHome: (req, res) => {

  	var db = require.main.require('./db.js');
	getToken().then(
		db.localities.findAll(function(err, result) {
	        if (err)
	        {
	          res.status(404);
	          return;
	        }
	        
	        res.render('pages/home', { suburbs: result});
	    }));
  }
};


async function getToken() {
	const https = require('https');

	https.get('https://access-api.corelogic.asia/access/oauth/token?grant_type=client_credentials&client_id=21b64c45&client_secret=0e39218c67d9cdc727df04f8936addfd', 
		(res) => {

		  var body = '';
		  res.on('data', (d) => {
		  	
		  	body += d;
		  	
		  });

		  res.on('end', function() {

	            var parsed = JSON.parse(body);
	            global.access_token = parsed.access_token;
//console.log(global.access_token);
	        });

	}).on('error', (e) => {
	  console.error(e);
	});

	
}