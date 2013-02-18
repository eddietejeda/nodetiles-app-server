  /* Set up the libraries */
var nodetiles = require('nodetiles-core'),
    PostGISSource = nodetiles.datasources.PostGIS,
    GeoJsonSource = nodetiles.datasources.GeoJson,
    Projector = nodetiles.projector,
    path = require('path'),
    express = require('express'),
    app = module.exports = express(),
    fs = require('fs'),
    TileJSON = require('./app/tilejson');
    


var PORT = process.env.PORT || process.argv[2] || 5000;
var DEBUG = true;




/* Create your map context */
var map = new nodetiles.Map();
var tilejson = new TileJSON({
  mapCenter: [90.0761,29.9531,17],
  mapName: "neworleans"
});


var db_connection = '';
if(process.env.PRODUCTION){
  connectionString = "tcp://" + process.env.DATABASE_URL;
}
else{
  connectionString = "tcp://postgres@localhost/blightstatus_be";
}

map.addData(new PostGISSource({
  connectionString: connectionString, // required
  tableName: "addresses",  // required
  geomField: "point",  // required
  // fields: "speed, shape_len",  // optional, speeds things up
  name: "addresses",    // optional, uses table name otherwise
  projection: 'EPSG:900913',   // optional, defaults to 4326
  requestParams: {
    open_cases : { 
      required : false,  //defaults to false, @TODO implement required conditions
      statement: ' open_count >= :open_cases '
    },
    closed_cases : { 
      required : false,
      statement: ' closed_count >= :closed_cases '
    }
  }

}));
  

/* Link your Carto stylesheet */
map.addStyle(fs.readFileSync('./styles/style.mss','utf8'));



//
// Configure Express Express
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
app.get('/tile.json', nodetiles.route.tileJson(tilejson));



// 1. Serve Index.html
app.get('/', function(req, res) {
  res.sendfile(__dirname + '/index.html');
});
    
app.listen(PORT);
console.log("Express server listening on port %d in %s mode", PORT, app.settings.env);