const mongoose = require('mongoose');
const Institution = require('../models/Institution');

mongoose.connect("mongodb://localhost:27017/testDB",{useNewUrlParser:true}, function(){
  console.log("Successfully Connected to Books Database");
});

const BooksSchema = new mongoose.Schema({
    ISBN:{
        type: Number,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    author:{
        type:String,
        required: true
    },
    institute:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Institution'
    }
})

const Books = mongoose.model('Books',BooksSchema);

module.exports = Books