/* Set up the libraries */
var nodetiles = require('nodetiles-core'),
    PostGISSource = nodetiles.datasources.PostGIS,
    GeoJsonSource = nodetiles.datasources.GeoJson,
    Projector = nodetiles.projector,
    path = require('path'),
    express = require('express'),
    app = module.exports = express(),
    fs = require('fs');


var PORT = process.env.PORT || process.argv[2] || 3000;
var DEBUG = true;




/* Create your map context */
var map = new nodetiles.Map({
    projection: "EPSG:4326" // set the projection of the map
});

map.addData(new PostGISSource({
  connectionString: "tcp://postgres@localhost/neworleans_roads", // required
  tableName: "neworleans_roads_schema",                              // required
  geomField: "the_geom",                            // required
  // fields: "speed, shape_len",                        // optional, speeds things up
  name: "oakland_streets",                                     // optional, uses table name otherwise
  projection: 'EPSG:4326',                                   // optional, defaults to 4326
  // projection: 4326,                                   // optional, defaults to 4326
}));


/* Link your Carto stylesheet */
map.addStyle(fs.readFileSync('./styles/style.mss','utf8'));



// -122.364,37.6927,-122.0756,37.8945

/* Render out the map to a file */
map.render({
  // Make sure your bounds are in the same projection as the map
  bounds: {minX: -122.364, minY: 37.6927, maxX: -122.0756, maxY: 37.8945},
  width: 800,   // number of pixels to output
  height: 400,
  callback: function(err, canvas) {
    var file = fs.createWriteStream(__dirname + '/map.png'),
        stream = canvas.createPNGStream();

    stream.on('data', function(chunk){
      file.write(chunk);
    });

    stream.on('end', function(){
      console.log('Saved map.png!');
    });
  }
});



// // Wire up the URL routing
// app.use('/tiles', nodetiles.route.tilePng({ map: map })); // tile.png
// app.use('/utfgrids', nodetiles.route.utfGrid({ map: map })); // utfgrids
// // tile.json: use app.get for the tile.json since we're serving a file, not a directory
// app.get('/tile.json', nodetiles.route.tileJson({ path: __dirname + '/map/tile.json' }));


// //
// // Configure Express routes
// //
// app.configure('development', function(){
//   app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  
//   // Backbone routing
//   app.use('/assets', express.static(__dirname + '/assets'));
// });

// app.configure('production', function(){
//   app.use(express.errorHandler());
//   io.set('log level', 1); // reduce logging
  
//   // Backbone routing: compilation step is included in `npm install` script
//   app.use('/app', express.static(__dirname + '/dist/release'));
//   app.use('/assets/js/libs', express.static(__dirname + '/dist/release'));
//   app.use('/assets/css', express.static(__dirname + '/dist/release'));
//   app.use(express.static(__dirname + '/public'));
// });


// // 1. Serve Index.html
// app.get('/', function(req, res) {
//   res.sendfile(__dirname + '/index.html');
// });
    
// app.listen(PORT);
// console.log("Express server listening on port %d in %s mode", PORT, app.settings.env);