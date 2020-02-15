const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BulletinScheme = new Schema({
    authorMail: {
        type: String,
        required: true,
        unique: false
      },
    rating: Number,
    category: String,
    preview: String,
    text: String,
    id: String, 
    findId: {
        type: String,
        unique: true,
    },
    name: String,
    image: String,
})

BulletinScheme.statics.findBulletinByUser = function (email, cb) {
    return this.find({ authorMail: email }, cb)
}

BulletinScheme.statics.findBulletinByCategory = function (category, cb) {
    return this.find({ category: category }, cb)
}

BulletinScheme.statics.findBulletinBySearch = function (findId, cb) {
    return this.find({ findId: findId }, cb)
}

BulletinScheme.statics.returnAll = function (cb) {
    return this.find({}, cb)
}

const Bulletin = mongoose.model('Bulletin', BulletinScheme);
module.exports = Bulletin;