const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required:true
    },
    age: {
        type: Number,
        required: true
    },
});

const Pet = mongoose.model('pets', petSchema);

module.exports = Pet;