module.exports = {
  "adr": {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "description": "An Address following the convention of http://microformats.org/wiki/hcard",
    "type": "object",
    "properties": {
        "post-office-box": { "type": "string" },
        "extended-address": { "type": "string" },
        "street-address": { "type": "string" },
        "locality":{ "type": "string" },
        "region": { "type": "string" },
        "postal-code": { "type": "string" },
        "country-name": { "type": "string"}
    },
    "required": ["locality", "street-address", "postal-code"],
    "dependencies": {
        "post-office-box": ["street-address"],
        "extended-address": ["street-address"]
    }
  },
  "geo": {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "description": "A geographical coordinate",
    "type": "object",
    "properties": {
        "latitude": { "type": "number" },
        "longitude": { "type": "number" }
    }
  },
  "_attachments": {
    "type": "object",
    "description": "CouchDB doc _attachments property handling for inline (Base64) attachment uploads",
    "patternProperties": {
      "^([A-Za-z_\-]+/)+start\.png$": {
        "type": "object",
        "properties": {
          "content_type": { "type": "string", "pattern": "^image\/png$" },
          "data": { "type": "string" }
        }
      }
    }
  },
  "_revisions": {
    "type": "object",
    "description": "a private CouchDB property of every doc - must be included to handle the validation in a validate_doc_update.js",
    "properties": {
      "start": { "type": "number" },
      "ids": { "type": "array" }
    }
  },
  "ThingsOnPhotos": {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "description": "A representation of a thing at a photo",
    "type": "object",
    "required": ["_id","_rev","title","created_at","adr","geo"],
    "properties": {
      "_id": { "type": "string", "pattern": "^[a-f0-9]{32}$" },
      "_rev": { "type": "string", "pattern": "^[0-9]+\\-[a-f0-9]{32}$" },
      "title": { "type": "string" },
      "desc": { "type": "string" },
      "created_at": { "type": "string", "pattern": "^[0-9]{4}-[0-1][0-9]-[0-3][0-9]T[0-2][0-9]:[0-5][0-9]:[0-5][0-9][+][0-1][0-9][0-5][0-9]$" },
      "adr": { "$ref": "adr" },
      "geo": { "$ref": "geo" },
      "_attachments": { "$ref": "_attachments" },
      "_revisions": { "$ref": "_revisions" }
    }
  }
}