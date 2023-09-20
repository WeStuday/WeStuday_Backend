const Grade = require('./../Models/gradeModel')
const Level = require('./../Models/levelModel')

const createGrade = async (req, res) => {
    const title = req.body.title
    const level = req.body.level
    if (!title || !level) res.status(400).json({ message: 'title and level are required' })

    let grade = new Grade({ title, level })
    await grade.save()
        .then(async newGrade => {
            const lvl = await Level.findById(level)
            if (!lvl) {
                newGrade.deleteOne()
                return res.status(400).json({ message: 'no such a level' })
            }
            lvl.grades = [...lvl.grades, newGrade._id];
            await lvl.save()

            return res.status(200).json(newGrade)
        })
        .catch(e => {
            return res.status(500).json({ message: e.message })
        })
}

const getGrades = async (req, res) => {
    Grade.find({}).populate({ path: "semesters" })
        .then((grades) => res.status(200).json(grades))
        .catch(e => res.status(500).json({ message: e.message }))
}

const getGrade = async (req, res) => {
    const _id = req.params.id.toString().trim();
    if (!_id) { res.status(400).json({ message: "id is required" }); return; }
    await Grade.findById(_id).populate({ path: "semesters" })
        .then(grd => res.status(200).json(grd))
        .catch(e => res.status(500).json({ message: e.message }))
}

const editGrade = async (req, res) => {
    const _id = req.params.id.toString().trim();
    const title = req.body.title;
    if (!_id) { res.status(400).json({ message: 'id is required' }); return; }
    if (!title) { res.status(400).json({ message: 'please enter the edited title' }); return; }
    await Grade.findByIdAndUpdate(_id, { title }, { new: true, runValidators: true })
        .then((grd) => { res.status(200).json(grd) })
        .catch(e => res.status(500).json({ message: e.message }))
}

const deleteGrade = async (req, res) => {
    const _id = req.params.id.toString().trim();
    if (!_id) { res.status(400).json({ message: 'id is required' }); return; }
    await Grade.findByIdAndDelete(_id)
        .then(grd => res.status(200).json({ message: 'deleted succussfully' }))
        .catch(e => console.log(e))
}

module.exports = {
    createGrade, getGrades, getGrade, editGrade, deleteGrade
}