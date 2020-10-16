var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchma = new mongoose.Schema({
    username: String,
    passwprd: String
}); 

UserSchma.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchma);