const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriberSchema = mongoose.Schema({
    userTo :  {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    userFrom : {
        type : Schema.Types.ObjectId,
        ref:'User'
    }
}, {timestamps : true}); // timestamps true하면 만든 date와 update한 date가 표시됨.



const Subscriber = mongoose.model('Subscriber', subscriberSchema);

module.exports = { Subscriber }