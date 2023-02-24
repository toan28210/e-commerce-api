import mongoose from "mongoose"

const OrderSchema = new mongoose.Schema(
    {
        userId: {type: String, required: true},
        amount: {
            type: Number, 
            required: true
        },
        address: {type: String, required: true},
        status: {type: String, default: "pending"}
    },
    {timestamps: true}
)

export default mongoose.model("Order", OrderSchema)