const Semester = require('./../Models/semesterModel')
const Grade = require('./../Models/gradeModel')

const createSemester = async (req, res) => {
    const title = req.body.title
    const grade = req.body.grade
    if (!title || !grade) res.status(400).json({ message: 'title and grade are required' })

    let semester = new Semester({ title, grade })
    await semester.save()
        .then(async newSemester => {
            const grd = await Grade.findById(grade)
            if (!grd) {
                newSemester.deleteOne()
                return res.status(400).json({ message: 'no such a grade' })
            }
            grd.semesters = [...grd.semesters, newSemester._id];
            await grd.save()

            return res.status(200).json(newSemester)
        })
        .catch(e => {
            return res.status(500).json({ message: e.message })
        })
}

const getSemesters = async (req, res) => {
    Semester.find({}).populate({ path: "subjects" })
        .then((semesters) => res.status(200).json(semesters))
        .catch(e => res.status(500).json({ message: e.message }))
}

const getSemester = async (req, res) => {
    const _id = req.params.id.toString().trim();
    if (!_id) { res.status(400).json({ message: "id is required" }); return; }
    await Semester.findById(_id).populate({ path: "subjects" })
        .then(smstr => res.status(200).json(smstr))
        .catch(e => res.status(500).json({ message: e.message }))
}

const editSemester = async (req, res) => {
    const _id = req.params.id.toString().trim();
    const title = req.body.title;
    if (!_id) { res.status(400).json({ message: 'id is required' }); return; }
    if (!title) { res.status(400).json({ message: 'please enter the edited title' }); return; }
    await Semester.findByIdAndUpdate(_id, { title }, { new: true, runValidators: true })
        .then((smstr) => { res.status(200).json(smstr) })
        .catch(e => res.status(500).json({ message: e.message }))
}

const deleteSemester = async (req, res) => {
    const _id = req.params.id.toString().trim();
    if (!_id) { res.status(400).json({ message: 'id is required' }); return; }
    await Semester.findByIdAndDelete(_id)
        .then(smstr => res.status(200).json({ message: 'deleted succussfully' }))
        .catch(e => console.log(e))
}

module.exports = {
    createSemester, getSemesters, getSemester, editSemester, deleteSemester
}