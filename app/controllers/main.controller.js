module.exports = {

  // show the home page
  showHome: (req, res) => {

  	var fs = require('fs');
  	var path = require('path');
	
	var text = fs.readFileSync(path.resolve(__dirname) + '/../../locality.txt').toString();
	//console.log(text);

	getToken().then(
		function() {
		    res.render('pages/home', 
		    	{ suburbs: text.split(require('os').EOL).map(function(s) {
		    		var info = s.split(' ');
		    		var len = info.length;
		    		return {
			    		name: info.slice(0, len - 2).join(' '),
			    		lId: info[len - 2]
						}
					})
				}
			);
		}
	)
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