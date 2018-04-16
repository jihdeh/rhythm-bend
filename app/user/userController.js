import crypto from 'crypto'
import passport from 'koa-passport'
import LocalStrategy from 'passport-local'
import User from './userModel'


const authenticate = (type,ctx) =>{
                                    return passport.authenticate(type,(err, user, info, status) => {
                                        if (user) {
                                            ctx.status = 200
                                            ctx.body = {
                                                data:{  
                                                        email:user.email,
                                                        id:user._id,
                                                        name:user.name,
                                                        type:user.type
                                                    }
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

const response = (user,ctx) =>{
                    if(user){
                        ctx.status = 200
                        ctx.body={
                            data:{  
                                email:user.email,
                                id:user._id,
                                name:user.name,
                                type:user.type
                            }
                        }
                    }else if(!user){
                        ctx.status = 200
                        ctx.body={
                            data:{  
                                message:'user not found'
                            }
                        }
                }
            }

const reject = (e,ctx) =>{
                        ctx.status = 400
                        ctx.body={
                            status: 'error',
                            data:e
                        }
                    }

exports.login = async ctx => authenticate('local-signin',ctx)

exports.register = async ctx => authenticate('local-signup',ctx)

exports.update = async ctx => {
                                try{
                                    const user = await User.findByIdAndUpdate(
                                                                                ctx.params.uid,
                                                                                ctx.request.body,
                                                                                { new : true }
                                                                            )
                                    response(user,ctx)
                                }catch(e){
                                        reject(e,ctx)
                                }
                            }

exports.delete= async ctx =>{
                                try{
                                    const user = await User.findByIdAndRemove( ctx.params.uid ) 
                                    response(user,ctx)
                                }catch(e){
                                        reject(e,ctx)
                                }
                                
                            }
