module.exports = {
  init: function(context, callback) {
		  const express    = require('express'),
		  expressLayouts = require('express-ejs-layouts'),
		  bodyParser     = require('body-parser'),
		  session        = require('express-session'),
		  cookieParser   = require('cookie-parser'),
		  flash          = require('connect-flash'),
		  expressValidator = require('express-validator');

		context.app = app = express();
		
		// configure our application ===================
		// set sessions and cookie parser
		app.use(cookieParser());
		app.use(session({
		  secret: process.env.SECRET, 
		  cookie: { maxAge: 60000 },
		  resave: false,    // forces the session to be saved back to the store
		  saveUninitialized: false  // dont save unmodified
		}));
		app.use(flash());

		// tell express where to look for static assets
		app.use(express.static(__dirname + '/public'));

		// set ejs as our templating engine
		app.set('view engine', 'ejs');
		app.use(expressLayouts);

		// use body parser to grab info from a form
		app.use(bodyParser.urlencoded({ extended: true }));
		app.use(expressValidator());

		// set the routes =============================
		app.use(require('./app/routes'));

  	    callback();
  }
};
