const mongoose = require('mongoose');
const Books = require('../models/Books');

mongoose.connect("mongodb://localhost:27017/testDB",{useNewUrlParser:true}, function(){
  console.log("Successfully Connected to Instituion Database");
});

const InstitutionSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    url:{
        type: String,
        required: true
    },
    emailDomain:{
        type:String,
        required: true
    }
})

const Institution = mongoose.model('Institution',InstitutionSchema);

module.exports = Institution