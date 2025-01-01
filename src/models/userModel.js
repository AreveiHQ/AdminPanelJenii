import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        validate: {
            validator: (name) => {
                const nameRegex = /^[a-zA-Z ]{2,}$/;
                return nameRegex.test(name);
            },
            message: 'Invalid name format',
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (email) => {
                const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                return emailRegex.test(email);
            },
            message: 'Invalid email format',
        },
    },
    phone: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    addresses:[{
        type:String,
}],
    isVerified: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    forgotPasswordToken:String,
    forgotPasswordTokenExpiry:Date,
    verifyToken:String,
    verifyTokenExpiry:Date,
    otp: {
        type: String
    },
    otpExpires: {
        type: Date
    },
    
}, {
    timestamps: true
});


const User = mongoose.models.User ||mongoose.model('User', userSchema);

export default User;