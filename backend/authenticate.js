var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var passport=require('passport');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var LocalStrategy=require('passport-local');
var User=require('./models/user');
var config = require('./config.js');

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey,
        {expiresIn: 3600});
};


exports.verifyUser = (req,res,next)=>{
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        // console.log(bearerToken);
      jwt.verify(bearerToken,config.secretKey,(err,authData)=>{
            if(err){
                res.sendStatus(403);
            }
            else{
                // console.log(authData);
                req.user=authData;
                next();
            }
        })
    }
    else{
        res.sendStatus(403);
    }
    
}
exports.verifyAdmin= (req,res,next)=>{
    if(req.user.user.admin)
    {
        next();
    }
    else{
        err=new Error('You are not allowed to perform this operation!');
        next(err);
    }
}
 
