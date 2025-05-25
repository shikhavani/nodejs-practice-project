const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "First Name is required"],
            trim: true,
            minLength: 2,
            maxLength: 100,
        },
        lastName: {
            type: String,
            trim: true,
            minLength: 2,
            maxLength: 100,
        },
        emailId: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            validate: {
                validator: function (value) {
                    if (!validator.isEmail(value)) {
                        throw new Error(value + " is not valid email");    
                    }
                }
            }
        },
        password: { 
            type: String,
            required: true
        },
        age: {
            type: Number,
            required: true,
            min: 8
        },
        gender: {
            type: String,
            required: true,
            trim: true,
            maxLength: 100,
            enum: {
                values: ['female', 'male', 'other'],
                message: '{VALUE} is not supported'
            }
            // only called when new data is inserted
            // validate (value) {
            //     if (["female", "male", "other"].includes(value)) {
            //         throw new Error ("Could not validate gender")
            //     }
            // }
        },
        photoURL: {
            type: String,
            default: "", // Default profile picture URL,
            trim: true,
            validate: {
                validator: function (value) {
                    if (value && !validator.isURL(value)) {
                        throw new Error(value + " is not valid Photo URL");    
                    }
                }
            }
        },
        aboutMe: {
            type: String,
            maxLength: 1000,
            default: "No description provided"
        },
        skills: {
            type: [String],
            validate: {
                validator: function (value) {
                    return value.length <= 10; // Maximum length of the array
                },
                message: 'Skills array exceeds the maximum allowed length of 10'
            }
        },
    }, 
    // for adding createdAt and updatedAt fields
    {
        timestamps: true
    }
);

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({_id: user._id}, "DEV@SV21", {
        expiresIn: "1d"
    }); // hiding info inside jwt and secret key which is known only to the server
    return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;
    const isPasswordCorrect = await bcrypt.compare(passwordInputByUser, passwordHash);
    return isPasswordCorrect;
};

module.exports = mongoose.model('User', userSchema);