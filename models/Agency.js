var pg        = require("pg").native,
    nodetiles = require('nodetiles-core'),
    Projector = nodetiles.projector;



    
    
var Agency = function(req, res, options) {
  this.req = req || {};
  this.res = res || {};
  this.options = options || {};
  this.settings = options || {};
  
  //defaults
  if(process.env.NODE_ENV  == 'production'){
    console.log('Production Database');
    this.connectionString = process.env.DATABASE_URL;
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
    

  // if (this.options.agencyName){
  //   this.agencyName = this.options.agencyName
  // }
  // else{
  //   throw new Error("You must set options.agencyName");    
  // }

  this.client = new pg.Client(this.connectionString);
    
  return this;
}

Agency.prototype = {
  constructor: Agency,
  
  getSettings : function(err_callback, success_callback){
    var client = this.client,
        options = this.options,
        req = this.req,
        res = this.res;       

    client.connect(function(err) {
      console.log('********** connection error', err);

      client.query("SELECT settings FROM agencies WHERE alias=$1 LIMIT 1;", [options.agencyName], function(err, result) {
        if(err){
          console.log("*************RESPONSE ERROR",err)          
        }
        else{
          if(result.rows){
            this.settings = JSON.parse(result.rows[0]['settings']); 
            success_callback(this.settings);          
          }
        }
      });
    });
  }
  
  
}



module.exports = Agency;