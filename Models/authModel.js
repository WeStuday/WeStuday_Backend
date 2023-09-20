const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require("bcryptjs");

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        trim: true,
        minlength: 8,
        validate(val) {
            let password = new RegExp(
                "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"
            );
            if (!password.test(val)) {
                throw new Error(
                    "password must include uppercase, lowercase, number, special character !@#$%^&*",
                    "يجب ان تحتوي كلمة السر احرف كبيرة , واحرف صغيرة , وارقام و احرف خاصة "
                );
            }
        },
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        validate(val) {
            if (!validator.isEmail(val)) throw new Error("email is invalid");
        },
    },

    role: {
        type: String,
        default: 'admin'
    },
})

adminSchema.pre("save", async function () {
    if (this.isModified("password")) {
        const salt = await bcryptjs.genSalt(8);
        this.password = await bcryptjs.hash(this.password, salt);
    }
});


adminSchema.methods.toJson = function () {
    const userObject = this.toObject(); 
    delete userObject.password;
    return userObject;
};

// Login
adminSchema.statics.findByCredentials = async (mail, pass) => {
    const user = await Admin.findOne({ email: mail });
    if (!user) {
        throw new Error("Incorrect Email or Password!, Please check again..")
    }
    const isMatch = await bcryptjs.compare(pass, user.password)
    if (!isMatch) {
        throw new Error("Incorrect Email or Password!, Please check again..")
    }
    return user
}

module.exports = mongoose.model('Admin', adminSchema)
