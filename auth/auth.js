module.exports = {
    ensureAuthenticated : (req,res,next)=>{
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error_msg',"Please login to access");
        res.redirect('/users/signin');
    }
}