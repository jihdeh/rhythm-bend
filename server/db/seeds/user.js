import User from '../../../app/user/userModel'
import userController from '../../../app/user/userController'
import log from '../../../util/log'
import _ from 'lodash'
import crypto from 'crypto'

export default function(){
log.info('Seeding the Database')

const users=[
    {username:'jimmlo',password:'test'},
    {username:'xoko',password:'test'},
    {username:'katamon',password:'test'}
]

let encryptPass = (alldata) =>{
   let salt = crypto.randomBytes(128).toString('hex')
   let newData = alldata.map((data)=>{
            let _data = data
            _data.password=userController.hashPassword(data.password,salt)
            return _data
        })
    
    return newData
}

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
    let promises = encryptPass(users).map((user)=>createDoc(User,user))
    return Promise.all(promises)
            .then((users)=>_.merge({users:users},data || {}))
            .catch((err)=>console.log('user exists'))
}

cleanDB()
    .then(createUsers)
    .then((users)=>log.info('Seeded db with 3 users'))
    .catch((err)=>log.error(err))
}