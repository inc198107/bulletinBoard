const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserScheme = new Schema({
    email: String,
    password: String
},
{
  autoCreate: true,
  autoIndex: true
});

UserScheme.statics.findUserByEmail = function(email, cb){
    return this.findOne(email, cb)
}

const User = mongoose.model('User', UserScheme);
module.exports = User