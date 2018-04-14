import passport from 'koa-passport'
import LocalStrategy from 'passport-local'
import User from '../app/user/userModel'
import userController from '../app/user/userController'

export default function(){
const options = {
    session: false
}

passport.serializeUser((user,done)=>done(null,user.id))

passport.deserializeUser((id,done)=>{
    return User.findById(id)
                .then((user) => {done(null,user)})
                .catch((err) => {done(err,null)})
})

passport.use(new LocalStrategy(options,(username,password,done)=>{
    User.findOne({username})
        .then((user)=>{
            if (!user) return done(null,false)
            if (userController.hashPassword(password,user.password.salt).hash === user.password.hash){
                return done(null,{username:user.username})
            } else {
                return done(null,false)
            }
        })
        .catch((err)=>{ return done(err)})
}))
}