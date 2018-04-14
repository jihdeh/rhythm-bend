import mongoose from 'mongoose'

const user = mongoose.Schema({
    username:{
        required:true,
        type:String,
        unique:true
    },
    password:{
        salt:{
            required:true,
            type:String
        },
        hash:{
            required:true,
            type:String
        }
    }
})

export default mongoose.model("Users",user)