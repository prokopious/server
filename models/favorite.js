const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var favoriteSchema = new Schema({
    dishes:  [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish'
    }],
    user:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
}, {
    timestamps: true
});

const Favorites = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorites;