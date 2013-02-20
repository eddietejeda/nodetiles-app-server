// Set up the libraries
var nodetiles = require('nodetiles-core'),
    PostGISSource = nodetiles.datasources.PostGIS,
    Projector = nodetiles.projector,
    path = require('path'),
    express = require('express'),
    app = module.exports = express(),
    fs = require('fs'),
    TileJSON = require('./app/tilejson');
    AddressDatabase = require('./db/AddressDatabase');
    

// Some general settings
var PORT = process.env.PORT || process.argv[2] || 5000;
var DEBUG = true;


// Create your map context
var map = new nodetiles.Map();


// Generate the TileJSON
var tilejson = new TileJSON({ mapCenter: [90.0761,29.9531,17],
                              mapName: "neworleans" });

// Automatically configure the database
var database = new AddressDatabase();




// console.log(database);

// Connect the database to the map
map.addData(database);
  

// Link your Carto stylesheet
map.addStyle(fs.readFileSync('./styles/style.mss','utf8'));


// Configure Express Express
app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());  
});


// Wire up the URL routing
app.use('/tiles', nodetiles.route.tilePng({ map: map })); // tile.png
app.use('/utfgrids', nodetiles.route.utfGrid({ map: map })); // utfgrids
app.get('/tile.json', nodetiles.route.tileJson(tilejson));


// Serve a basic index.html
app.get('/', function(req, res) {
  res.sendfile(__dirname + '/index.html');
});

// Set up server to listen in PORT
app.listen(PORT);
console.log("Express server listening on port %d in %s mode", PORT, app.settings.env);