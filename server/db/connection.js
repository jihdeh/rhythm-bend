import mongoose from 'mongoose'

export default function(app){
    const url = "mongodb://jornie:jornie@ds047722.mlab.com:47722/soundit"

    mongoose.connect(url)
            .then(()=>
                console.info(`==> ✅  Database connection established`)
            )
            .catch(err=>console.error(err))
}