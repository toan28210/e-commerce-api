import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
    {
        username: {type: String, required: true, uinique: true},
        password:{type: String, required: true},
        email: {type: String, required: true},
        avatar: {type: String, required: false},
        phone: {type: Number, required: false},
        address: {type: String, required: false},
        isAdmin: {
            type: Boolean,
            default: false,
        },
    },
    {timestamps: true}
)

export default mongoose.model("User", userSchema);