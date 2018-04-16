import User from '../../../app/user/userModel'
import log from '../../../util/log'
import _ from 'lodash'

export default function(){
log.info('Seeding the Database')

const users=[
    {email:'jimmlo@x.com',firstName:'jim',lastName:'zing',password:'test',type:'voter'},
    {email:'jimmy@x.com',firstName:'kim',lastName:'kar',password:'test',type:'contestant'},
    {email:'xoko@x.com',firstName:'jake',lastName:'mark',password:'test',type:'contestant'}
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
        let newuser = new User(user)
        newuser.password = newuser.hashPassword(user.password,newuser.saltPassword())
        
        return  newuser
                .save()
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