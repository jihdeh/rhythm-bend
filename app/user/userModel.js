import mongoose from 'mongoose'
import crypto from 'crypto'

const user = mongoose.Schema({
    email:String,
    password:{
        salt:String,
        hash:String
    },  
    name:String,
    type:String
})


user.methods.saltPassword = () => (crypto.randomBytes(128).toString('hex'))

user.methods.hashPassword = (password,salt) => {
    let hash = crypto.createHmac('sha256',salt)
                     .update(password)
                     .digest('hex')       
        return{
            salt,
            hash
        }
}

export default mongoose.model("Users",user)