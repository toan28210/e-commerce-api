const mongoose = require("mongoose")

const RatingSchema = new mongoose.Schema(
    {
        userId: {type: String, required: true},
        productId: {type: String, required: true},
        response:{type: String, required: true},
        rating:{type: Number, required: true},
    },
    {timestamps: true}
)
module.exports = mongoose.model("Rating", RatingSchema)