import mongoose from "mongoose"

const RatingSchema = new mongoose.Schema(
    {
        userId: {type: String, required: true},
        productId: {type: String, required: true},
        response:{type: String, required: true},
        rating:{type: Number, required: true},
    },
    {timestamps: true}
)
export default mongoose.model("Rating", RatingSchema)