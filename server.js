var async = require('async');

// Settings for our application. We'll load them from a separate file -
// our first Node module. Use ./ to access a file in the current
// directory. Use them to start building our 'context' object, which
// provides access to all the important stuff we may need throughout
// the application

var context = {};

// load environment variables
require('dotenv').config();

const port = process.env.PORT || 8080;

async.series([setupDb, setupApp, listen], ready);

function setupApp(callback)
{
  // Create the Express app object and load our routes
  context.app = require('./app.js');
  context.app.init(context, callback);
}

function setupDb(callback)
{
  // Create our database object
  context.db = require('./db.js');

  // Set up the database connection, create context.db.posts object
  context.db.init(context, callback);
}

// Ready to roll - start listening for connections
function listen(callback)
{
  context.app.listen(port);
  callback(null);
}

function ready(err)
{
  if (err)
  {
    throw err;
  }
  console.log(`App listening on port ${port}`);
}
