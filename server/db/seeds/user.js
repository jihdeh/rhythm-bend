import User from '../../../app/user/userModel'
import log from '../../../util/log'
import _ from 'lodash'
import crypto from 'crypto'

export default function(){
log.info('Seeding the Database')

const users=[
    {email:'jimmlo@x.com',password:'test'},
    {email:'jimmy@x.com',password:'test'},
    {email:'xoko@x.com',password:'test'}
]

const createDoc = (model,doc)=>(
    new Promise(
        (resolve,reject)=>( 
            new model(doc).save((err,saved)=>
                (err? reject(err) : resolve(saved))))))


const cleanDB = ()=>{
    log.info('...cleaning the DB')

    var cleanPromises = [User]
    .map((model)=>(model.remove().exec()))

    return Promise.all(cleanPromises)
}

const createUsers = (data)=>{
    let promises = users.map((user)=>{
        let newuser = new User()
        newuser.password = newuser.hashPassword(user.password,newuser.saltPassword())
        newuser.email = user.email

        return  newuser
                .save()
                .catch(e=>console.log('user exists'))
    })

    return Promise.all(promises)
            .then((users)=>_.merge({users:users},data || {}))
            .catch((err)=>console.log('user exists'))
}

cleanDB()
    .then(createUsers)
    .then((users)=>log.info('Seeded db with 3 users'))
    .catch((err)=>log.error(err))
}