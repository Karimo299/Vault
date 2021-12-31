//Required Modules
const http = require('http');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

// Global Vars
const user = document.getElementById('user_name');
const pass = document.getElementById('password');
const ruser = document.getElementById('ruser_name');
const rpass = document.getElementById('rpassword');
const rpass2 = document.getElementById('rpassword2');

// Mongojs setup
const mongojs = require('mongojs');
const db = mongojs('127.0.0.1/vault', ['users']);

// Creates a schema
let userID = new Schema({
  Username: {
    type: String,
    unique: true
  },
  Key: String
}, {collection: 'user'});

// Makes schema into a useable consturctor function
var person = mongoose.model('User', userID)

// The function fired to register
function send() {
  if (rpass.value != rpass2.value) {
    return alert('Sorry the passwords do not match');
  }

  //Creates the hash
  bcrypt.genSalt(14, function(err, salt) {
    bcrypt.hash(rpass.value, salt, function(err, hash) {
      //Uses the consturctor schema to make an object to put in the data base
      var newUser = new person({Username: ruser.value, Key: hash});

      // Show Details to the client
      alert("Uesername: " + newUser.Username + " || " + "Password: " + rpass.value);

      //Inserts the user id to the database
      db.users.insert(newUser, function(err, result) {
        if (err) {
          throw err;
        }

        //Redirects to Login. Keep here bc it will redirect to login b4 it saves
        setTimeout(() => {
          window.location = 'index.html';
        }, 500);
      }); // end of db
    }); //end of bcrypt.hass
  }); // end of gen salt
} // end of send function


// Set up conection with database
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/vault";

function login() {
  var userInfo;

  //Connects to database
  MongoClient.connect(url, function(err, db) {
    if (err) {
      throw err;
    }

    // looks in the database for user
    db.collection("users").findOne({Username: user.value}, function(err, result) {
      if (err){
        throw err;
      }
      //Random vars
      userInfo = result;
      var hash = userInfo.Key;

      // Decrypts password
      bcrypt.compare(pass.value, hash, function(err, res) {
        if (err) {
          return console.log(err);
        }
        if (res) {
          window.location = "vault.html";
        } else {
          alert("Invalid Password")
        }
      }); // End of dcrypt
      db.close();
    }); // End of search
  }); // End connection
} // End function
