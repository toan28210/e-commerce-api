import mongoose from "mongoose"

const LikeSchema = new mongoose.Schema(
    {
        userId: {type: String, required: true},
        productId: {type: String, required: true}
    },
    {timestamps: true}
)

export default mongoose.model("Like", LikeSchema)