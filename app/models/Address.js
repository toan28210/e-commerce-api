import mongoose from "mongoose"
const AddressSchema = new mongoose.Schema(
    {
        userId: {type: String, required: true},
        name: {type: String, required: true},
        email: {type: String, required: true},
        phone: {type: Number, required: true},
        address: {type: String, required: true},
        zipcode: {type: String, required: true},
        city: {type: String, required: true},
        country: {type: String, required: true}

    },
    {timestamps: true}
)

export default mongoose.model("Address", AddressSchema)