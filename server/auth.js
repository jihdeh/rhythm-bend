import passport from 'koa-passport'
import LocalStrategy from 'passport-local'
import User from '../app/user/userModel'
import userController from '../app/user/userController'
import crypto from 'crypto'

const options = {
    usernameField : 'email',
    passwordField : 'password'
}


passport.serializeUser((user,done)=>done(null,user))

passport.deserializeUser((user,done)=>done(null,user))

function localsignin (){
passport.use('local-signin',new LocalStrategy(options,(email,password,done)=>{
    User.findOne({ email })
        .then((user)=>{
            if (!user) return done(null,false,"User does not exist")
            if (user.hashPassword(password,user.password.salt).hash===user.password.hash){
                return done(null,user)
            } else {
                return done(null,false,"Password does not match")
            }
        })
        .catch((err)=>{ return done(err)})
}))
}

function localsignup (){
    passport.use('local-signup',new LocalStrategy(options,(email,password,done)=>{
        User.findOne({ 'email' : email })
            .then((user)=>{
                if (user){ 
                    return done(null,false,"This username is already taken")
                }else{
                      let newuser = new User()
                          newuser.password = newuser.hashPassword(password,newuser.saltPassword())
                          newuser.email = email
                          
                                newuser
                                .save((err,saved)=>{
                                    if(err){
                                    return done(null, false,err)
                                    }
                                    if(saved){
                                        return done(null,saved)
                                    }
                                }) 
                }
            })
            .catch((err)=>{ return done(err)})
    }))
    }

export default function (){
    localsignin()
    localsignup()
}