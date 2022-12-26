const mongoose = require("mongoose")

const LikeSchema = new mongoose.Schema(
    {
        userId: {type: String, required: true},
        productId: {type: String, required: true}
    },
    {timestamps: true}
)

module.exports = mongoose.model("Like", LikeSchema)