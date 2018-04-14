import mongoose from 'mongoose'

const user = mongoose.Schema({
    username:{
        required:true,
        type:String,
        unique:true
    },
    password:{
        type:String,
        required:true,
    }
})

export default mongoose.model("Users",user)