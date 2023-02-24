import mongoose from "mongoose"
const AddressSchema = new mongoose.Schema(
    {
        userId: {type: String, required: true},
        name: {type: String, required: true},
        phone: {type: Number, required: true},
        addressStreet: {type: String, required: true},
        address: {type: String, required: true},
        isdefault: {type: Boolean, required: false, default: false}
    },
    {timestamps: true}
)

export default mongoose.model("Address", AddressSchema)