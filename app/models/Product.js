import mongoose from "mongoose"
const ProductSchema = new mongoose.Schema(
    {
        title: {type: String, required: true, uinique: true},
        desc:{type: String, required: true},
        img:{type: String, required: true},
        amount:{type: Number, required: true},
        sold:{type: Number, required: true, default: 0},
        like:{type: Number, required: true, default: 0},
        rating: {type: Number, required: true, default: 0},
        reviewscore: {type: Number, required: true, default: 0},
        categories:{type: Array},
        size:{type: Array},
        color:{type: Array},
        price:{type: Number, required: true},
        inStock:{type: Boolean, default: true},
    },
    {timestamps: true}
)

ProductSchema.index({title: 'text', desc: 'text'})

export default mongoose.model("Product", ProductSchema)