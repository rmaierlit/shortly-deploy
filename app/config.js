var path = require('path');
var mongoose = require('mongoose');

var db = mongoose.connect('mongodb://localhost/27017');

module.exports = db;
