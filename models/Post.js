const mongoose = require('mongoose');
const schema = mongoose.Schema;

const postSchema = new schema({


    user:{
        type: schema.Types.ObjectId,
        ref:'users'
    },

    title:{
        type: String,
        required: true
    },

    status:{
        type: String,
        default: 'public'
    },

    allowComments:{
        type: Boolean,
        required: true
    },

    body:{
        type: String,
        required: true
    },

    img: {
        data: String,
        contentType: String
    },

    date:{
        type: Date,
        default: Date.now()
    },
    category:{
        type: schema.Types.ObjectId,
        ref: 'categories'
    },

    comments:[{
        type: schema.Types.ObjectId,
        ref: 'comments'
    }]

},{usePushEach: true});

module.exports = mongoose.model('posts',postSchema);