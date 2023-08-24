import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
        unique: true,
    },
    email:{
        type:String,
        required: true,
        unique: true,
    },
    password:{
        type:String,
    },
    imgUrl: {
        type:String,
        default: 'https://www.iprcenter.gov/image-repository/blank-profile-picture.png/@@images/image.png'
    },
    subscribers: {
        type: Number,
        default: 0
    },
    subscribedUsers: {
        type: [String],
    },
    fromGoogle: {
        type: Boolean,
        default: false
    }

}, { timestamps: true})

export default mongoose.model('user', UserSchema)