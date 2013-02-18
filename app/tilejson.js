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

  //defaults
  this.template = "{{{OBJECTID_1}}} {{{OBJECTID}}} {{{AREA}}} {{{PERIMETER}}} {{{ACRES}}} {{{HECTARES}}} {{{GEOPIN}}} {{{IN_DATE}}} {{{SITUS_DIR}}} {{{SITUS_STRE}}} {{{SITUS_TYPE}}} {{{SITUS_NUMB}}} {{{SITUS_ST_1}}} {{{SITUS_STAT}}} {{{SHAPE_area}}} {{{SHAPE_len}}}"
  this.maxZoom = 20;
  this.minZoom = 15;
  this.mapId = 'map';
  this.baseDomain = 'http://0.0.0.0:5000';

  //required user options
  if (!options.mapName) {
    throw new Error("You must set options.mapName");
  }
  else{
    this.mapName = options.mapName;
  }

  if (!options.mapCenter) {
    throw new Error("You must set options.mapCenter");
  }
  else{
    this.mapCenter = options.mapCenter;    
  }



  
  return this;
}



TileJSON.prototype = {
  constructor: TileJSON,

  toJSON: function() {

    return {
        "basename"    : this.mapName + ".tiles",
        "center"      : this.mapCenter, 
        "description" : "Lovingly crafted with Node and node-canvas.",
        "attribution" : "Data by Data",
        "grids"       :  [this.baseDomain + "/utfgrids/{z}/{x}/{y}.json"],
        "legend"      : "<div style=\"text-align:center;\"><div style=\"font:12pt/16pt Georgia,serif;\">San Francisco</div><div style=\"font:italic 10pt/16pt Georgia,serif;\">by Ben and Rob</div></div>",
        "id"          : this.mapId,
        "maxzoom"     : this.maxZoom,
        "minzoom"     : this.minZoom,
        "name"        : this.mapName,
        "scheme"      : "xyz",
        "template"    : this.template,    
        "tiles"       : [this.baseDomain + "/tiles/{z}/{x}/{y}.png"],
        "version"     : "0.1.0",
        "webpage"     : "http://github.com/eddietejeda/nodetiles-init"
    }
  }
  
}



module.exports = TileJSON;
