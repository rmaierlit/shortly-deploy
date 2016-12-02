// NOTE: this file is not needed when using MongoDB
var db = require('../config');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var Link = require('../models/link');

// var Links = new db.Collection();

// Links.model = Link;

var Links = new Schema({
  url: {type: String, required: true},
  baseUrl: {type: String, required: true},
  code: {type: String, required: true},
  title: {type: String},
  visits: {type: Number},
  'created_at': {type: Date, default: Date.now},
  'updated_at': {type: Date, default: Date.now}
});

module.exports = Links;