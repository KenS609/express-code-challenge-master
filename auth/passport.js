const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/Users');

module.exports = (passport)=>{
    passport.use(
        new localStrategy({username:'email'},(email,password,done)=>{
            //Matchin User
            User.findOne({email:email})
            .then(user=>{
                if(!user){
                    return done(null,false,{message:'User is not registered'});
                }
                // Matching password
                bcrypt.compare(password,user.password, (err, isMatch)=>{
                    if(err) throw err;
                    if(isMatch){
                        return done(null,user);
                    }else{
                        return done(null,false,{message:'Incorrect password'});
                    }
                })
            })
            .catch(err=> console.log(err));
        })
    );

    passport.serializeUser((user, done)=> {
        done(null, user.id);
      });
      
      passport.deserializeUser((id, done)=>{
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
}