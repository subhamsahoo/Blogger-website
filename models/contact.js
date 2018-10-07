const mongoose = require('mongoose');
const schema = mongoose.Schema;

const contactSchema = new schema({
    name:{
        type: String,
        required: true
    },

    email:{
        type: String,
        required: true
    },

    phone:{
        type: String,
        required: true
    },

    message:{
        type: String,
        required: true
    },

    date:{
        type: Date,
        default: Date.now()
    }

});

module.exports = mongoose.model('contacts',contactSchema);