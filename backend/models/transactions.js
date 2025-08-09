const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    orderId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Order', 
        required: true 
    },
    customerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Customer', 
        required: true 
    },
    amount: { 
        type: Number, 
        required: true, 
        min: 0 
    },
    paymentMethod: { 
        type: String, 
        enum: ['Online', 'Cash'], 
        required: true 
    },
    paymentStatus: { 
        type: String, 
        enum: ['Pending', 'Completed', 'Failed', 'Verified'], 
        default: 'Pending' 
    },
    // SSLCOMMERZ specific fields
    transactionId: { 
        type: String, 
        unique: true, 
        sparse: true
    },
    sessionId: { 
        type: String 
    },
    gatewayData: {
        type: mongoose.Schema.Types.Mixed
    },
    // Payment verification/completion
    verifiedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Rider' 
    },
    verifiedAt: { 
        type: Date 
        // No default - only set when actually completed/verified
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Transaction', transactionSchema);