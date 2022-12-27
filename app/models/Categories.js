import mongoose from "mongoose"

const CategoriesSchema = new mongoose.Schema(
    {
        nameCate: {type: String, required: true, uinique: true},
        img:{type: String, required: true},
        cat:{type: String, required: true},
    },
    {timestamps: true}
)

export default mongoose.model("Category", CategoriesSchema)