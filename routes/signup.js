var express = require('express');
var router = express.Router();

var Accountdata = require('../models/accountdata').Accountdata;

/* POST Signup Data */
router.post('/', function(req, res) {
  var username = req.body.username; 
  var password = req.body.password;
  var email = req.body.email;
  var age = req.body.age;
  var gender = req.body.gender;
  Accountdata.findOne({ name: { $regex: new RegExp(username, "i") } }, function(err, doc) {  
    if(!err && !doc) {
      
      var newAccountdata = new Accountdata(); 

      newAccountdata._id = username; 
      newAccountdata.password = password;
      newAccountdata.email = email;
      newAccountdata.age = age;
      newAccountdata.gender = gender;
      newAccountdata.timestamp = new Date().toString();

      
      newAccountdata.save(function(err) {

        if(!err) {
          res.json(201, {message: "Account: " + newAccountdata.username + " was created." });    
        } else {
          res.json(500, {message: "Could not create account. Error: " + err});
        }

      });

    } else if(!err) {
      //Trying to use a taken username
      res.json(403, {message: "Account already exists"}); 
    } else {
      res.json(500, { message: err});
    } 
  });

});

module.exports = router;

