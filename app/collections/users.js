// NOTE: this file is not needed when using MongoDB
var db = require('../config');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var User = require('../models/user');

// var Users = new db.Collection();

// Users.model = User;

var Users = new Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  'created_at': {type: Date, default: Date.now},
  'updated_at': {type: Date, default: Date.now}
});

module.exports = Users;