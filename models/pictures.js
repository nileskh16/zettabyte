var mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    url: {type: String, required: true},
    size: {type: Number, required: true},
    imageType: {type: String, required: true}
}, {
    timestamps: true
});

const PictureModel = mongoose.model('picture', imageSchema);

module.exports = PictureModel;