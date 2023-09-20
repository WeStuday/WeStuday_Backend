const Subject = require('./../Models/subjectModel')
const Semester = require('./../Models/semesterModel')

const createSubject = async (req, res) => {
    const title = req.body.title
    const semester = req.body.semester
    if (!title || !semester) res.status(400).json({ message: 'title and semester are required' })

    let subject = new Subject({ title, semester })
    await subject.save()
        .then(async newSubject => {
            const smstr = await Semester.findById(semester)
            if (!smstr) {
                newSubject.deleteOne()
                return res.status(400).json({ message: 'no such a semester' })
            }
            smstr.subjects = [...smstr.subjects, newSubject._id];
            await smstr.save()

            return res.status(200).json(newSubject)
        })
        .catch(e => {
            return res.status(500).json({ message: e.message })
        })
}

const getSubjects = async (req, res) => {
    Subject.find({}).populate({ path: "chapters" })
        .then((subjects) => res.status(200).json(subjects))
        .catch(e => res.status(500).json({ message: e.message }))
}

const getSubject = async (req, res) => {
    const _id = req.params.id.toString().trim();
    if (!_id) { res.status(400).json({ message: "id is required" }); return; }
    await Subject.findById(_id).populate({ path: "chapters" })
        .then(sbj => res.status(200).json(sbj))
        .catch(e => res.status(500).json({ message: e.message }))
}

const editSubject = async (req, res) => {
    const _id = req.params.id.toString().trim();
    const title = req.body.title;
    if (!_id) { res.status(400).json({ message: 'id is required' }); return; }
    if (!title) { res.status(400).json({ message: 'please enter the edited title' }); return; }
    await Subject.findByIdAndUpdate(_id, { title }, { new: true, runValidators: true })
        .then((sbj) => { res.status(200).json(sbj) })
        .catch(e => res.status(500).json({ message: e.message }))
}

const deleteSubject = async (req, res) => {
    const _id = req.params.id.toString().trim();
    if (!_id) { res.status(400).json({ message: 'id is required' }); return; }
    await Subject.findByIdAndDelete(_id)
        .then(sbj => res.status(200).json({ message: 'deleted succussfully' }))
        .catch(e => console.log(e))
}

module.exports = {
    createSubject, getSubjects, getSubject, editSubject, deleteSubject
}