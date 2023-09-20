const mongoose = require("mongoose");

const levelSchema = new mongoose.Schema({
    title: { type: String, required: [true, "title is required"], trim: true, unique: true },
    numberOfFiles: { type: Number, default: 0, },
    grades: [{
        type: mongoose.Types.ObjectId, ref: 'Grade'
    }]
})

const Level = mongoose.model("Level", levelSchema)
module.exports = Level;