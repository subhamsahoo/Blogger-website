const mongoose = require('mongoose');
const schema = mongoose.Schema;

const commentSchema = new schema({

    user:{
        type: schema.Types.ObjectId,
        ref:'users'
    },


    approveComment:{
        type: Boolean,
        default: true
    },

    body:{
        type: String,
        required: true
    },

    date:{
        type: Date,
        default: Date.now()
    }

});

module.exports = mongoose.model('comments',commentSchema);