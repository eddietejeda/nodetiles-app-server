  /* Set up the libraries */
var nodetiles = require('nodetiles-core'),
    PostGISSource = nodetiles.datasources.PostGIS,
    GeoJsonSource = nodetiles.datasources.GeoJson,
    Projector = nodetiles.projector,
    path = require('path'),
    express = require('express'),
    app = module.exports = express(),
    fs = require('fs');


var PORT = process.env.PORT || process.argv[2] || 5000;
var DEBUG = true;




/* Create your map context */
var map = new nodetiles.Map();

map.addData(new PostGISSource({
  connectionString: "tcp://postgres@localhost/blightstatus_be", // required
  tableName: "addresses",                              // required
  geomField: "point",                            // required
  // fields: "speed, shape_len",                        // optional, speeds things up
  name: "addresses",                                     // optional, uses table name otherwise
  projection: 'EPSG:900913',                                   // optional, defaults to 4326
}));


/* Link your Carto stylesheet */
map.addStyle(fs.readFileSync('./styles/style.mss','utf8'));



//
// Configure Express routes
//
app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());  
});


// Wire up the URL routing
app.use('/tiles', nodetiles.route.tilePng({ map: map })); // tile.png
app.use('/utfgrids', nodetiles.route.utfGrid({ map: map })); // utfgrids
// tile.json: use app.get for the tile.json since we're serving a file, not a directory
app.get('/tile.json', nodetiles.route.tileJson({ path: __dirname + '/map/tile.json' }));



// 1. Serve Index.html
app.get('/', function(req, res) {
  res.sendfile(__dirname + '/index.html');
});
    
app.listen(PORT);
console.log("Express server listening on port %d in %s mode", PORT, app.settings.env);