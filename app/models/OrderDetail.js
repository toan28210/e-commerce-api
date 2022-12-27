import mongoose from "mongoose"

const OrderDetailSchema = new mongoose.Schema(
    {
        orderId: {type: String, required: true},
        productId: {type: String, require: true},
        quantity: {type: Number, required: true}
    },
    {timestamps: true}
)

export default mongoose.model("OrderDetail", OrderDetailSchema)