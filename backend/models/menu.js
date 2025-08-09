const mongoose= require('mongoose');

const menuSchema = new mongoose.Schema({
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    items: [{
        name: { type: String, required: true },
        description: { type: String, required: true },
        imageUrl: { type: String},
        price: { type: Number, required: true, min: 0 },
        category: { type: String, required: true },
        isAvailable: { type: Boolean, default: true }
    }]
    });

module.exports = mongoose.model('Menu', menuSchema);