/**
*  Provides the most basic forms of routes
*
*  @module routes
*/
var fs = require('fs');


/**
*  Creates a route map tiles. Supports two different kinds of routes. 
*
*  Examples:
* 
*     The URL structure should be something like: 
*     /:zoom/:col/:row.png 
*
*  @param {Object} options  The options parameters needs to have options.map defined.
*  @return {Circle} The new Circle object.
*  @api public
*/
var TileJSON = function(options) {
  var options = options || {};

  //defaults
  this.template = '{{{geopin}}} {{{street_id}}} {{{house_num}}} {{{street_name}}} {{{street_type}}} {{{address_long}}} {{{case_district}}} {{{status}}} {{{created_at}}} {{{updated_at}}} {{{point}}} {{{parcel_id}}} {{{assessor_url}}} {{{neighborhood_id}}} {{{latest_type}}} {{{latest_id}}} {{{double_id}}} {{{agency_id}}} {{{source_address_id}}} {{{source_parcel_id}}} {{{source_street_id}}} {{{open_count}}} {{{closed_count}}}'
  this.maxZoom = 20;
  this.minZoom = 15;
  this.mapId = 'map';


  if (options.agencyName) {
    this.mapName = options.agencyName;
  }
    
  if (options.mapCenter) {
    this.mapCenter = options.mapCenter;    
  }
    
    
  if (options.domain) {
    this.domain = options.domain;    
  }
  return this;
}



TileJSON.prototype = {
  constructor: TileJSON,

  set : function(options){
    var options = options || {};

    if (!options.agencyName) {
      throw new Error("You must set options.agencyName");
    }
    else{
      this.agencyName = options.agencyName;
      this.mapName = options.agencyName;
    }
    
    if (!options.mapCenter) {
      throw new Error("You must set options.mapCenter");
    }
    else{
      this.mapCenter = options.mapCenter;    
    }
    
    
    if (!options.domain) {
      throw new Error("You must set options.domain");
    }
    else{
      this.domain = options.domain;    
    }
    
    return this;
       
  },
  toJSON: function() {

    return {
        "basename"    : this.mapName + ".tiles",
        "center"      : this.mapCenter, 
        "description" : "Lovingly crafted with Node and node-canvas.",
        "attribution" : "Data by Data",
        "grids"       :  [this.domain + "/utfgrids/" + this.mapName +  "/{z}/{x}/{y}.json"],
        "legend"      : "<div style=\"text-align:center;\"><div style=\"font:12pt/16pt Georgia,serif;\">San Francisco</div><div style=\"font:italic 10pt/16pt Georgia,serif;\">by BlightStatus</div></div>",
        "id"          : this.mapId,
        "maxzoom"     : this.maxZoom,
        "minzoom"     : this.minZoom,
        "name"        : this.mapName,
        "scheme"      : "xyz",
        "template"    : this.template,    
        "tiles"       : [this.domain + "/tiles/" + this.mapName +  "/{z}/{x}/{y}.png"],
        "version"     : "0.1.0",
        "webpage"     : "http://github.com/eddietejeda/nodetiles-init"
    }
  }
  
}


module.exports = TileJSON;
