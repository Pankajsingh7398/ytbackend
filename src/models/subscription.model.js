import { Timestamp } from "mongodb";
import Mongoose,{schema } from "mongoose";
const subscriptionSchema = new schema({
    subscriber:{
        type:schema.Types.ObjectId,  
        ref:"User"
    },
    channel:{
        type:schema.Types.ObjectId,
        ref:"User"
    }

},{
timestamps:true
})
export const subscription=Mongoose.model(subscription,subscriptionSchema)