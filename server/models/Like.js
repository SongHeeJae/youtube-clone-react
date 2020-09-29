const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const likeSchema = mongoose.Schema({
   userId : {
       type:Schema.Types.ObjectId,
       ref:'User'
   },
   commentId : {
       type:Schema.Types.ObjectId,
       ref:'Comment'
   },
   videoId : {
    type:Schema.Types.ObjectId,
    ref:'Video'
   }
}, {timestamps : true}); // timestamps true하면 만든 date와 update한 date가 표시됨.

const Like = mongoose.model('Like', likeSchema);

module.exports = { Like }