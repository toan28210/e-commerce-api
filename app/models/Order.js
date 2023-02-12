import mongoose from "mongoose"

const OrderSchema = new mongoose.Schema(
    {
        userId: {type: String, required: true},
        amount: {
            type: Number, 
            required: true
        },
        ordersDetails:{
            type:Array
        },
        address: {type: Object, required: false},
        status: {type: String, default: "pending"}
    },
    {timestamps: true}
)

export default mongoose.model("Order", OrderSchema)