var pg        = require("pg").native,
    nodetiles = require('nodetiles-core'),
    when = require('when'),
    Projector = nodetiles.projector;

var Agency = function(options) {
  this.options = options || {};
  //defaults
  if(process.env.NODE_ENV  == 'production'){
    console.log('Production Database');
    this.connectionString = "tcp://" + process.env.DATABASE_URL;
  }
  else if (process.env.NODE_ENV  == 'development'){
    console.log('Development Database defined at NODE_DEVELOPMENT_DATABASE_URL');
    this.connectionString = "tcp://" + process.env.NODE_DEVELOPMENT_DATABASE_URL;
  }
  else if (this.options.connectionString){
    console.log('Provided Connection String Database');
    this.connectionString = "tcp://" + this.options.connectionString;
  }
  else{
    throw new Error("You must set options.connectionString");    
  }
  
  console.log('inside init options ' + this.options.agencyName);
  

  this.client = new pg.Client(this.connectionString);
    
  return this;
}

Agency.prototype = {
  constructor: Agency,
  
  getSettings : function(callback) {

    console.log('this.options.agencyName = ' + this.options.agencyName);
    // 
    // this._query(this.options.agencyName, callback);


    return this._query(this.options.agencyName).then(
    	function success(rows) {
        this.rows = rows;
        callback(rows);
        console.log('success');
        return rows;
        // console.log(rows);
        
    	},
    	function error(err) {
        console.log(err);
    	}
    );
    
  },
  
  
  _query : function(agencyName){
 	  var deferred = when.defer();
  
    var client = this.client;
    console.log('hello'  + agencyName);
    client.connect(function(err){
      client.query("SELECT * FROM Agencies WHERE alias=$1;", [agencyName], 
        function(err, result){        
      		deferred.resolve(result.rows[0]); 
        }
      )
    });

  	return deferred.promise;
  }
}



module.exports = Agency;