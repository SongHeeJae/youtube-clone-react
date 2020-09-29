const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = mongoose.Schema({
    writer : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    postId : {
        type : Schema.Types.ObjectId,
        ref : "Video"
    },
    responseTo : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    content : {
        type : String
    }
}, {timestamps : true}); // timestamps true하면 만든 date와 update한 date가 표시됨.



const Comment = mongoose.model('Comment', commentSchema);

module.exports = { Comment }