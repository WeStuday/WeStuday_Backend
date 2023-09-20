const Admin = require('../Models/authModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const register = async function (req, res, next) {
    const { username, email, password } = req.body
    try {
        if (!username || !email || !password) {
            throw new Error('username, email and password are required')
        }
        const existingUser = await Admin.findOne({ email: req.body.email });
        if (existingUser) throw new Error('User already exists');

        const newUser = new Admin({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        })
        await newUser.save()
        res.status(200).json(newUser)
    } catch (e) {
        console.log(e)
        return res.status(400).json({ message: e.message || 'has an error' })
    }
}

const login = async (req, res, next) => {
    try {
        const user = await Admin.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ message: 'Wrong password or username!' })
        }
        const isCorrect = bcrypt.compare(req.body.password, user.password);
        if (!isCorrect)
            return res.status(400).json({ message: 'Wrong password or username!' })

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET_KEY
        );
        const { password, ...info } = user._doc;
        res
            .cookie("accessToken", token, {
                httpOnly: false,
            })
            .status(200)
            .send(info);
    } catch (err) {
        next(err);
    }
};

const logout = async function (req, res) {
    res
        .clearCookie("accessToken", {
            sameSite: "none",
            secure: true,
        })
        .status(200)
        .send("User has been logged out.")
}

module.exports = {
    register,
    login,
    logout
}