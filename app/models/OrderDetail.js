import mongoose from "mongoose"

const OrderDetailSchema = new mongoose.Schema(
    {
        orderId: {type: String, required: true},
        productId: {type: mongoose.Types.ObjectId, require: true, ref: "Product"},
        quantity: {type: Number, required: true}
    },
    {timestamps: true}
)

export default mongoose.model("OrderDetail", OrderDetailSchema)