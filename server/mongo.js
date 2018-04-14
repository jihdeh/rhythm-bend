import mongoose from 'mongoose'

export default function(app){
    const url = "mongodb://jornie:jornie@ds153198.mlab.com:53198/soundit"

    mongoose.connect(url)
            .then(()=>
                console.info(`==> ✅  Database connection established`)
            )
            .catch(err=>console.error(err))
}