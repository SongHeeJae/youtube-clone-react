const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const videoSchema = mongoose.Schema({
    writer : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    title : {
        type:String,
        maxlength : 50
    },
    description : {
        type:String
    },
    privacy : {
        type:Number
    },
    filePath : {
        type:String
    },
    category : {
        type:String
    },
    view : {
        type:Number,
        default:0
    },
    duration : {
        type:String
    },
    thumbnail : {
        type : String
    }
}, {timestamps : true}); // timestamps true하면 만든 date와 update한 date가 표시됨.



const Video = mongoose.model('Video', videoSchema);

module.exports = { Video }