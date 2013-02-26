var nodetiles = require('nodetiles-core'),
    PostGISSource = nodetiles.datasources.PostGIS;

var AddressDatabase = function(options) {
  var options = options || {};

  
  //defaults
  if(process.env.NODE_ENV  == 'production'){
    console.log('Production Database');
    this.connectionString = "tcp://" + process.env.DATABASE_URL;
  }
  else if (process.env.NODE_ENV  == 'development'){
    console.log('Development Database defined at NODE_DEVELOPMENT_DATABASE_URL');
    this.connectionString = "tcp://" + process.env.NODE_DEVELOPMENT_DATABASE_URL;
  }
  else if (options.connectionString){
    console.log('Provided Connection String Database');
    this.connectionString = "tcp://" + options.connectionString;
  }
  else{
    throw new Error("You must set options.connectionString");    
  }
  
  console.log(this.connectionString);

  var connection = new PostGISSource({
    connectionString: this.connectionString, // required
    tableName: "addresses",  // required
    geomField: "point",  // required
    // fields: "speed, shape_len",  // optional, speeds things up
    name: "addresses",    // optional, uses table name otherwise
    projection: 'EPSG:900913',   // optional, defaults to 4326
    requestParams: {
      agency_id : { 
        _default : { agency_id : options.agency_id },  
        statement: ' agency_id >= :agency_id '
      },
      open_cases : { 
        statement: ' open_count >= :open_cases '
      },
      closed_cases : { 
        statement: ' closed_count >= :closed_cases '
      }
    }
  });
  
  // console.log(connection);
  return connection;
}


module.exports = AddressDatabase;