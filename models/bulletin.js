const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BulletinScheme = new Schema({
    authorMail: {
        type: String,
        required: true,
        unique: false
    },
    ratingCount: Number,
    votesCount: Number,
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
},
{
    autoCreate: true,
    autoIndex: true
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

BulletinScheme.statics.updateRating = function(findId, rating, voted, cb){
    this.findOneAndUpdate({ findId: findId }, {ratingCount: rating, votesCount: voted }, cb)
}

BulletinScheme.statics.deleteBulletin = function(findId, cb){
    return this.deleteOne({ findId: findId }, cb)
}

const Bulletin = mongoose.model('Bulletin', BulletinScheme);
module.exports = Bulletin;