import Router from 'koa-router'
import passport from 'koa-passport'
import LocalStrategy from 'passport-local'
import User from './userModel'
import usercontroller from './userController'

export default function register (app){
    const router = new Router({
        prefix: '/auth'
      })

    router
        .post('/signup',usercontroller.register)
        .post('/signin',usercontroller.login)
        .put('/:uid',usercontroller.update)
        .delete('/:uid',usercontroller.delete)

    app.use(router.routes()).use(router.allowedMethods())
}

