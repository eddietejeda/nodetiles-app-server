// Set up the libraries
var nodetiles = require('nodetiles-core'),
    PostGISSource = nodetiles.datasources.PostGIS,
    Projector = nodetiles.projector,
    path = require('path'),
    express = require('express'),
    app = module.exports = express(),
    fs = require('fs'),
    Address = require('./models/Address'),    
    TileJSON = require('./app/tilejson'),
    appServer = require('./app/server');

// Some general settings
var PORT = process.env.PORT || process.argv[2] || 5000;
var DEBUG = true;



// Automatically configure the database
var addresses = new Address();
// console.log(addresses);
 
// Generate the TileJSON
// expects the following JSON structure
// { mapCenter: [90.0761,29.9531,17],mapName: "neworleans" }
var tilejson = new TileJSON();

// Create your map context
var map = new nodetiles.Map();





// Connect the database to the map
map.addData(addresses);
  

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
app.use('/:agencyName/tiles', appServer.tilePng({ map: map })); // tile.png
app.use('/:agencyName/utfgrids', appServer.utfGrid({ map: map })); // utfgrids
app.get('/:agencyName/tile.json', appServer.tileJson({ tilejson: tilejson }));


// Serve a basic index.html
app.get('/', function(req, res) {
  res.sendfile(__dirname + '/index.html');
});

// Set up server to listen in PORT
app.listen(PORT);
console.log("Express server listening on port %d in %s mode", PORT, app.settings.env);