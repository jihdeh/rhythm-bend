import passport from 'koa-passport'
import LocalStrategy from 'passport-local'
import User from '../app/user/userModel'
import userController from '../app/user/userController'
import crypto from 'crypto'

const options = {
    session: false
}

passport.serializeUser((user,done)=>done(null,user.username))

passport.deserializeUser((user,done)=>done(null,user))

function localsignin (){
passport.use('local-signin',new LocalStrategy(options,(username,password,done)=>{
    User.findOne({username})
        .then((user)=>{
            if (!user) return done(null,false,"User does not exist")
            if (userController.hashPassword(password,user.password.salt).hash === user.password.hash){
                return done(null,{username:user.username})
            } else {
                return done(null,false,"Password does not match")
            }
        })
        .catch((err)=>{ return done(err)})
}))
}

function localsignup (){
    passport.use('local-signup',new LocalStrategy(options,(username,password,done)=>{
        User.findOne({username})
            .then((user)=>{
                if (user){ 
                    return done(null,false,"This username is already taken")
                }else{
                      let newuser = {}
                          newuser.password = userController.hashPassword(password,crypto.randomBytes(128).toString('hex'))
                          newuser.username = username

                          new User(newuser)
                                .save((err,saved)=>{
                                    if(err){
                                    return done(null, false,err);
                                    }
                                    if(saved){
                                        return done(null,{username:newuser.username});
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