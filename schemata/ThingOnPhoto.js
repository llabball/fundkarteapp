module.exports = {
  "$schema": "http://json-schema.org/draft-04/schema#",
  "description": "A representation of a thing at a photo",
  "type": "object",
  "required": ["_id","title","created_at","adr","geo"],
  "properties": {
    "_id": { "type": "string", "pattern": "^[a-f0-9]{32}$" },
    "_rev": { "type": "string", "pattern": "^[0-9]+\\-[a-f0-9]{32}$" },
    "title": { "type": "string" },
    "desc": { "type": "string" },
    "created_at": { "type": "string", "pattern": "^[0-9]{4}-[0-1][0-9]-[0-3][0-9]T[0-2][0-9]:[0-5][0-9]:[0-5][0-9][+][0-1][0-9][0-5][0-9]$" },
    "adr": {
      "type": "object",
      "required": ["locality", "street-address", "postal-code"],
      "properties": {
          "post-office-box": { "type": "string" },
          "extended-address": { "type": "string" },
          "street-address": { "type": "string" },
          "locality":{ "type": "string" },
          "region": { "type": "string" },
          "postal-code": { "type": "string" },
          "country-name": { "type": "string"}
      },
      "dependencies": {
        "post-office-box": ["street-address"],
        "extended-address": ["street-address"]
      }
    },
    "geo": {
      "type": "object",
      "properties": {
        "latitude": { "type": "number" },
        "longitude": { "type": "number" }
      }
    },
    "_attachments": {
      "type": "object",
      "patternProperties": {
        "^([A-Za-z_\-]+/)+start\.png$": {
          "type": "object",
          "properties": {
            "content_type": { "type": "string", "pattern": "^image\/png$" },
            "data": { "type": "string" },
            "revpos": { "type": "number" },
            "length": { "type": "number" },
            "stub": { "type": "boolean"}
          }
        }
      }
    },
    "_revisions": {
      "type": "object",
      "properties": {
        "start": { "type": "number" },
        "ids": { "type": "array" }
      }
    }
  }
}