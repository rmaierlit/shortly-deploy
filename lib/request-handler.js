var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var Users = require('../app/collections/users');
var Links = require('../app/collections/links');
var User = require('../app/models/user');
var Link = require('../app/models/link');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  // Links.reset().fetch().then(function(links) {
  //   res.status(200).send(links.models);
  // });
  Link.find({}, function(err, result) {
    if (err) {
      console.log(err);
      res.status(500);
    } else {
      res.status(200).send(result);
    }
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.sendStatus(404);
  }

  Link.findOne({ url: uri }).then(function(found) {
    if (found && found._id) {
      res.status(200).send(found);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.sendStatus(404);
        }
        // console.log('headers', req.headers);
        pathArray = uri.split( '/' );
        protocol = pathArray[0];
        host = pathArray[2];
        baseUrl = protocol + '//' + host;
        var newLink = new Link({
          url: uri,
          title: title,
          baseUrl: req.headers.origin || baseUrl
        });
        newLink.make();
        // console.log(newLink);
        newLink.save().then(function(result) {
          res.status(200).send(result);    
        }, function(err) {
          console.log(err);
          res.sendStatus(500);
        });
      });
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username })
    .then(function(user) {
      if (!user || !user.username) {
        res.redirect('/login');
      } else {
        user.comparePassword(password) 
          .then(function(match) {
            if (match) {
              util.createSession(req, res, user);
            } else {
              res.redirect('/login');
            }
          });
      }
    });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.find({ username: username })
    .then(function(user) {
      if (!user.username) {
        var newUser = new User({
          username: username,
          password: password
        });
        newUser.make()
        .then(newUser.save)
        .then(function() {
          util.createSession(req, res, newUser);
        });
      } else {
        console.log('Account already exists');
        res.redirect('/signup');
      }
    });
};

exports.navToLink = function(req, res) {
  // Link.findOne({ code: req.params[0] }).then(function(link) {
  //   if (!link) {
  //     res.redirect('/');
  //   } else {
  //     console.log('hi mom', link);
  //     link.set({ visits: link.get('visits') + 1 })
  //       .save()
  //       .then(function() {
  //         return res.redirect(link.get('url'));
  //       });
  //   }
  // });
  Link.findOneAndUpdate({ code: req.params[0] }, null, null, function(err, doc) {
    console.log(doc);
    if (err) { return res.send(500, { error: err }); }
    if (!doc) {
      res.redirect('/');
    } else {
      doc.set({ visits: doc.get('visits') + 1 });
      doc.save();
      return res.redirect(doc.get('url'));
    }
  });
};