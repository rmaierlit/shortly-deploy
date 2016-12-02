var db = require('../config');
var crypto = require('crypto');
var Links = require('../collections/links.js');
var mongoose = require('mongoose');
//mongoose.Promise = Promise;
// var Link = db.Model.extend({
//   tableName: 'urls',
//   hasTimestamps: true,
//   defaults: {
//     visits: 0
//   },
//   initialize: function() {
//     this.on('creating', function(model, attrs, options) {
//       var shasum = crypto.createHash('sha1');
//       shasum.update(model.get('url'));
//       model.set('code', shasum.digest('hex').slice(0, 5));
//     });
//   }
// });

var Link = mongoose.model('Links', Links);

Link.prototype.make = function() {
  var shasum = crypto.createHash('sha1');
  shasum.update(this.url);
  this.set('code', shasum.digest('hex').slice(0, 5));
};

module.exports = Link;
