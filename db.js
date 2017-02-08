// We'll be using MongoDB
var mongo = require('mongodb');

// These variables are local to this module
var db;
var localitycollections;
var context;
var settings;

module.exports = db = {
  // Initialize the module. Invokes callback when ready (or on error)
  init: function(contextArg, callback) {

    var MongoClient = require('mongodb').MongoClient;
    var locality = 'locality';

    MongoClient.connect(process.env.DB_URI, function(err, db) {
      if(err) { return console.dir(err); }

      db.collection(locality, {strict:true}, function(err, collection) {

        if (err) {
          console.log('initing locality data');

          db.createCollection(locality, function(err, collection) {});

          var collection = db.collection(locality);

          var text =  `Adelaide SA 5000 22677 1407129
  Baldivis WA 6171 31357 1707634
  Beaconsfield VIC 3807 24608 1606555
  Blacktown NSW 2148 17412 1105436
  Broadbeach QLD 4218 27803 1306800
  Cooloongup WA 6168 31780 1707631
  Devonport TAS 7310 117121 1510008
  Durack NT 0830 22562 1204949
  Glenside SA 5065 23126 1407177
  Humpty Doo NT 0836 22585 1204953
  Kambah ACT 2902 22464 1005957
  Monash ACT 2904 22478 1005959
  North Adelaide SA 5006 23847 1407132
  Oxley ACT 2903 22485 1005958
  Quakers Hill NSW 2763 21064 1105868
  Rockingham WA 6168 33246 1707631
  Seven Hills NSW 2147 21319 1105435
  Southport QLD 4215 30522 1306797
  Surfers Paradise QLD 4217 30634 1306799
  Latrobe TAS 7307 117280 1509984
  Officer VIC 3809 26436 1606557
  Pakenham VIC 3810 26456 1606558
  Ulverstone TAS 7315 117655 1510035`;

          var docs = text.split('\n').map(s => {
            var words = s.split(' ');

            var len = words.length;
            
            return {
              locality: words.slice(0, len - 2).join(' '),
              localityId: words[len - 2],
              postcodeId: words[len - 1]
            }
          });

          collection.insert(docs, {w:1}, function(err, result) { if (err) return console.dir(err);});
        }
        callback();
      });

      localitycollections = db.collection(locality);
    });

    /*
    context = contextArg;
    settings = context.settings;

    // Open the database connection
    var dbConnection = new mongo.Db(
      'admin', 
      new mongo.Server(process.env.DB_URI, settings.db.port, {}), 
      {});

    // db.open doesn't happen right away; we pass a callback function
    // to know when it succeeds
    dbConnection.open(function(err) {
      if (err)
      {
        // If something goes wrong, call the callback with the error so
        // server.js is aware of the problem
        callback(err);
      }
      // Fetch a MongoDB "collection" (like a table in SQL databases)
      localitycollections = dbConnection.collection('post');

      // Make sure that collection has a unique index on the "slug" field
      // before we continue. This ensures we don't have two blog posts
      // with the same slug. Once again, we pass a callback function
      localitycollections.ensureIndex("slug", { unique: true }, function(err, indexName) 
      {
        // Now the database is ready to use (or an error has occurred). Invoke the callback
        callback(err);
      });
    });*/
  },
  // Group the methods relating to posts into a "posts" object, so we
  // can call db.posts.findAll, etc.
  localities: {
    // Find all posts in reverse order (blog order)
    findAll: function(callback) {
      if (localitycollections == null) console.log('localitycollections is null');
      localitycollections.find().sort({locality: 1}).toArray(function(err, res) {
        callback(err, res);
      });
    },
    // Fetch a particular post by its slug
    findOneByLId: function(iId, callback) {
      localitycollections.findOne({localityId: iId}, function(err, res) {
        callback(err, res);
      });
    },
    // Insert a new post
    insert: function(post, callback) {
      // Create a reasonable slug from the title
      post.slug = db.slugify(post.title);
      // Set the creation date/time
      post.created = new Date();
      // Pass the 'safe' option so that we can tell immediately if
      // the insert fails (due to a duplicate slug, for instance)
      localitycollections.insert(post, { safe: true }, function(err) {
        if (err)
        {
          callback(err);
        } 
        else
        {
          callback(err, post);
        }
      });
    }
  },
  // Create a reasonable slug for use in URLs based on the supplied string
  slugify: function(s)
  {
    // Note: you'll need to use xregexp instead if you need non-Latin character
    // support in slugs

    // Everything not a letter or number becomes a dash
    s = s.replace(/[^A-Za-z0-9]/g, '-');
    // Consecutive dashes become one dash
    s = s.replace(/\-+/g, '-');
    // Leading dashes go away
    s = s.replace(/^\-/, '');
    // Trailing dashes go away
    s = s.replace(/\-$/, '');
    // If the string is empty, supply something so that routes still match
    if (!s.length)
    {
      s = 'none';
    }
    return s.toLowerCase();
  }
};

