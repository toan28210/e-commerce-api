const mongoose = require("mongoose")

const CategoriesSchema = new mongoose.Schema(
    {
        nameCate: {type: String, required: true, uinique: true},
        img:{type: String, required: true},
        cat:{type: String, required: true},
    },
    {timestamps: true}
)

module.exports = mongoose.model("Category", CategoriesSchema)