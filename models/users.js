var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    mobile: {type: String, required: true, unique: true},
    password: {type: String, required: true}
}, {timestamps: true});

const UserModel = mongoose.model('user', userSchema);

module.exports = UserModel;