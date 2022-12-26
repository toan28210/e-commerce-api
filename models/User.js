const mongoose = require("mongoose")

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

module.exports = mongoose.model("User", userSchema)