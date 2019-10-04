const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const jsend = require('jsend');
const { ensureAuthenticated } = require('../auth/auth');


//Database
const User = require('../models/Users');
const Institution = require('../models/Institution');
const Book = require('../models/Books');


//Login page
router.get('/signin',(req,res)=> res.render('login'));

//register page
router.get('/create',(req,res)=>res.render('register'));


//register post handle
router.post('/create', (req,res)=>{
    const { name,email,role,password } = req.body;
    const errors = [];

    if(!name || !email || !role || !password ){
        errors.push({msg: 'Please fill in all Fields'});
    }

    if(password.length < 6){
        errors.push({msg:'Password should be at least 6 characters'});
    }

    if(errors.length > 0){
        res.render('register',{ 
            errors,
            name,
            email,
            role,
            password});
    }else{
        const domain = req.body.email.replace(/.*@/, "");
        
        Institution.findOne({emailDomain:domain})
            .then(dom =>{
                if(!dom){
                    errors.push({msg:'Domain does not exists in database'});
                    res.render('register',{ 
                        errors,
                        name,
                        email,
                        role,
                        password});
                }else{
                    User.findOne({email:email})
                    .then(user =>{
                        if(user){
                            errors.push({msg:'User already Exist!'})
                            res.render('register',{ 
                                errors,
                                name,
                                email,
                                role,
                                password});
                        }else{
                            const newUser = new User({
                                name:name,
                                email:email,
                                role:role,
                                password:password,
                                institute: dom._id
                            });

                            bcrypt.genSalt(10,(err,salt)=>{
                                bcrypt.hash(newUser.password,salt,(err,hash)=>{
                                    if(err) throw err;
                                    //Setting password to hash
                                    newUser.password = hash;
                                    // saving the user
                                    newUser.save()
                                        .then(()=>{
                                            req.flash('success_msg',"You are registered successfully!")
                                            res.redirect('/users/signin');
                                        })
                                        .catch(err => console.log(err));
                                });
                            });
                        }
                    })
            }
            
        });
    }

});


// Login handle
router.post('/signin',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect: '/users/login',
        failureRedirect: '/users/signin',
        failureFlash: true
    })(req,res,next);
});

// GET with Jsend Framework
router.get('/login',ensureAuthenticated,(req,res)=>{
    res.send(jsend.success({username:req.user.name}));
});


//GET Books
router.get('/login/books',ensureAuthenticated,(req,res,next)=>{

    User.findOne({name:req.user.name})
        .then(user=>{
            Institution.findOne({_id:user.institute})
                .then(inst =>{
                    Book.find({institute:inst._id})
                        .then(books =>{
                            res.send(books);
                        })
                        .catch(err=> console.log(err));
                    
                })
                .catch(err=>console.log(err));
        })
        .catch(err=>console.log(err));
    
});



  


//creating institute & books model

// const institute = new Institution({
//     name:'Virginia University',
//     url:'http://www.va.com',
//     emailDomain: 'va.com'
// });

// institute.save((err)=>{
//     if(err){console.log(err);}
//         const book = new Book({
//             ISBN:1113398980009,
//             title:'Future of IT',
//             author:'Jarne Stroustups',
//             institute: institute._id
//         });

//         book.save(err=>{
//             if(err){
//                 console.log(err);
//             }
//         }); 

// });


// Institution.findOne({emailDomain:'chicago.com'})
//     .then(inst=>{
//         if(inst){
//             const book = new Book({
//                 ISBN:5605905909834,
//                 title:'Chicago Special',
//                 author:'Heath wade',
//                 institute: inst._id
//             });
        
//             book.save(err=>{
//                 if(err){
//                     console.log(err);
//                 }
//             });        
//         }
//     })
//     .catch(err=>console.log(err));
    

module.exports = router;