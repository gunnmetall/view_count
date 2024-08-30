const mongoose = require('mongoose');

const {Schema} = mongoose;

const UserViewSchema = new Schema({
    userId      : String,
    productId   : String,
    viewDate    : Date
});
UserViewSchema.index({ userId: 1});
UserViewSchema.index({ productId: 1});

module.exports = mongoose.model('userView', UserViewSchema);

