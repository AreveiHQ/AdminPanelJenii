import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        validate: {
            validator: (name) => {
                const nameRegex =/^[A-Za-z0-9]+$/;
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
    },
    password: {
        type: String,
        required: true
    },
    addresses:{
        type:String,
},
    isVerified: {
        type: Boolean,
        default: false
    },
  role: { type: String, enum: ['superAdmin', 'admin','developer'], default: 'admin' },
    active: {
        type: Boolean,
        default: false
    },
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



userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.models.Admin || mongoose.model('Admin', userSchema);
export default User;
