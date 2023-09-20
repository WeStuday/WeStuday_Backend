const mongoose = require("mongoose");

const semesterSchema = new mongoose.Schema({
    title: { type: String, required: [true, "title is required"], trim: true, unique: true },
    numberOfFiles: { type: Number, default: 0, },
    subjects: [{
        type: mongoose.Types.ObjectId, ref: 'Subject'
    }],
    grade: { type: mongoose.Types.ObjectId, ref: 'Grade', required: [true, "grade id is required"] }
})

const Semester = mongoose.model("Semester", semesterSchema)
module.exports = Semester;