const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Academic', 'Social', 'Sports', 'Other']
    },
    eventDate: {
        type: Date,
        required: true
    },
    eventTime: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    ticketPrice: {
        type: Number,
        required: true,
        default: 0
    },
    organizedBy: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    capacity: {
        type: Number,
        required: true,
        min: 1
    },
    attendees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

// Add a virtual field for spots remaining
eventSchema.virtual('spotsRemaining').get(function() {
    return this.capacity - (this.attendees?.length || 0);
});

// Ensure virtuals are included in JSON
eventSchema.set('toJSON', { virtuals: true });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event; 