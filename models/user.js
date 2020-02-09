const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserScheme = new Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
},
  {
    autoCreate: true,
    autoIndex: true
  });

UserScheme.statics.findUserByEmail = function (email, cb) {
  return this.findOne({ email: email }, cb)
}

const User = mongoose.model('User', UserScheme);
module.exports = User