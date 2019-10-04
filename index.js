const express = require('express');
const app = express();
const ejs = require('ejs');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

//Passport Configuration
require('./auth/passport')(passport);

//Routes
const index = require('./routes/index.js');
const users = require('./routes/users');

//EJS
app.set('view engine', 'ejs');

//Bodyparser
app.use(bodyParser.urlencoded({extended:false}));

//express Session
app.use(session({
    secret:'node-express-challenge',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//Connect Flash
app.use(flash());

//Global Variables for flash
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});


app.get('/', index);
app.use('/users',users);



app.listen(3000, () => console.log(`Open http://localhost:3000 to see a response.`));