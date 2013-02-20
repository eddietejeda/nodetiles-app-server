var nodetiles = require('nodetiles-core'),
    PostGISSource = nodetiles.datasources.PostGIS;

var AddressDatabase = function(options) {
  var options = options || {};
  //defaults
  if(process.env.PRODUCTION){
    console.log('Production Database');
    this.connectionString = "tcp://" + process.env.DATABASE_URL;
  }
  else if (process.env.DEVELOPMENT_DATABASE_URL){
    console.log('Development Database');
    this.connectionString = "tcp://" + process.env.DEVELOPMENT_DATABASE_URL;
  }
  else if (options.connectionString){
    console.log('Provided Connection String Database');
    this.connectionString = "tcp://" + options.connectionString;
  }
  else{
    throw new Error("You must set options.connectionString");    
  }
  

  var connection = new PostGISSource({
    connectionString: this.connectionString, // required
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
  });
  
  // console.log(connection);
  return connection;
}


module.exports = AddressDatabase;




