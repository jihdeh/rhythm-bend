import crypto from 'crypto'
import passport from 'koa-passport'
import LocalStrategy from 'passport-local'
import User from './userModel'


exports.hashPassword = (password,salt) => {
                        let hash = crypto.createHmac('sha256',salt)
                                         .update(password)
                                         .digest('hex')
                    
                            return{
                                salt,
                                hash
                            }
                    }
exports.login = async ctx=>{
                               return passport.authenticate('local',(err, user, info, status) => {
                                if (user) {
                                    ctx.status = 200
                                    ctx.body = {
                                        data:user,
                                    }
                                } else {
                                  ctx.status = 400;
                                  ctx.body = { 
                                      status: 'error'
                                     };
                                }
                              })(ctx)
                            } 