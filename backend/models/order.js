const mongoose= require('mongoose');

const orderSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    riderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Rider' },
    items: [{
        itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu', required: true },
        quantity: { type: Number, required: true, min: 1 }
    }],
    totalAmount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['Pending', 'Accepted', 'In Progress', 'Delivered', 'Cancelled'], default: 'Pending' },
    orderDate: { type: Date, default: Date.now },
    deliveryAddress: { type: String, required: true },
    deliveryTime: { type: Date, required: true }
});
module.exports = mongoose.model('Order', orderSchema);  