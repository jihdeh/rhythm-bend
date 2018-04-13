import Router from 'koa-router'

export default function register (app){
    const router = new Router({
        prefix: '/auth'
      })

    router
        .post('/signup',(ctx,next)=>{})
        .post('/signin',(ctx,next)=>{})
        .put('/:id',(ctx,next)=>{})
        .delete('/',(ctx,next)=>{})

    app.use(router.routes()).use(router.allowedMethods())
}

