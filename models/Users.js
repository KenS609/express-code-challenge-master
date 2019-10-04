const mongoose = require('mongoose');
const Institution = require('../models/Institution');

mongoose.connect("mongodb://localhost:27017/testDB",{useNewUrlParser:true}, function(){
  console.log("Successfully Connected to User Database");
});

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    role:{
        type:String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    institute:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Institution'
    }
})

const User = mongoose.model('User',UserSchema);

module.exports = User