const mongoose = require("mongoose");

const gradeSchema = new mongoose.Schema({
    title: { type: String, required: [true, "title is required"], trim: true, unique: true },
    numberOfFiles: { type: Number, default: 0, },
    semesters: [{
        type: mongoose.Types.ObjectId, ref: 'Semester'
    }],
    level: { type: mongoose.Types.ObjectId, ref: 'Level', required: [true, "level id is required"] }
})

const Grade = mongoose.model("Grade", gradeSchema)
module.exports = Grade;