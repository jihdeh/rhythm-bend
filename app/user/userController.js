import crypto from 'crypto'
import passport from 'koa-passport'
import LocalStrategy from 'passport-local'
import User from './userModel'


function hashPassword (password,salt){
    let hash = crypto.createHmac('sha256',salt)
                     .update(password)
                     .digest('hex')       
        return{
            salt,
            hash
        }
}

const authenticate = (type,ctx) =>{
                                    return passport.authenticate(type,(err, user, info, status) => {
                                        if (user) {
                                            ctx.status = 200
                                            ctx.body = {
                                                data:user
                                            }
                                            return ctx.login(user)
                                        } else {
                                        ctx.status = 400
                                        ctx.body = { 
                                            status: 'error',
                                            data:info
                                            }
                                        }
                                    })(ctx)
                                }


exports.hashPassword = hashPassword

exports.login = async ctx => authenticate('local-signin',ctx)


exports.register = async ctx => authenticate('local-signup',ctx)