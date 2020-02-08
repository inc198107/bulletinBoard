const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BulletinScheme = new Schema({
    autor: Object,
    authorMail: String,
    rating: Number,
    category: String,
    preview: String,
    text: String,
    id: Number,
    name: String,
    image: Buffer
},
{
    autoCreate: true,
    autoIndex: true
});


BulletinScheme.statics.findBulletinByUser = function (email, cb) {
    return this.find(email, cb)
}

BulletinScheme.statics.findBulletinByCategory = function (category, cb) {
    return this.find(ategory, cb)
}

const Bulletin = mongoose.model('Bulletin', BulletinScheme);
module.exports = Bulletin;