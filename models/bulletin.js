const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BulletinScheme = new Schema({
    authorMail: String,
    rating: Number,
    category: String,
    preview: String,
    text: String,
    id: {
        type: Number,
        unique: true,
    },
    name: String,
    image: {
        name: String,
        contentType: String,
        image: Buffer
    }
},
    {
        autoCreate: true,
        autoIndex: true
    });


BulletinScheme.statics.findBulletinByUser = function (email, cb) {
    return this.find({ authorMail: email }, cb)
}

BulletinScheme.statics.findBulletinByCategory = function (category, cb) {
    return this.find({ category: category }, cb)
}

const Bulletin = mongoose.model('Bulletin', BulletinScheme);
module.exports = Bulletin;