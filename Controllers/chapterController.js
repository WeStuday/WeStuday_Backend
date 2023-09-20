const Chapter = require('./../Models/chapterModel')
const Subject = require('./../Models/subjectModel')

const createChapter = async (req, res) => {
    const title = req.body.title
    const subject = req.body.subject
    if (!title || !subject) res.status(400).json({ message: 'title and subject are required' })

    let chapter = new Chapter({ title, subject })
    await chapter.save()
        .then(async newChapter => {
            const smstr = await Subject.findById(subject)
            if (!smstr) {
                newChapter.deleteOne()
                return res.status(400).json({ message: 'no such a subject' })
            }
            smstr.chapters = [...smstr.chapters, newChapter._id];
            await smstr.save()

            return res.status(200).json(newChapter)
        })
        .catch(e => {
            return res.status(500).json({ message: e.message })
        })
}

const getChapters = async (req, res) => {
    Chapter.find({})
        .then((chapters) => res.status(200).json(chapters))
        .catch(e => res.status(500).json({ message: e.message }))
}

const getChapter = async (req, res) => {
    const _id = req.params.id.toString().trim();
    if (!_id) { res.status(400).json({ message: "id is required" }); return; }
    await Chapter.findById(_id)
        .then(sbj => res.status(200).json(sbj))
        .catch(e => res.status(500).json({ message: e.message }))
}

const editChapter = async (req, res) => {
    const _id = req.params.id.toString().trim();
    const title = req.body.title;
    if (!_id) { res.status(400).json({ message: 'id is required' }); return; }
    if (!title) { res.status(400).json({ message: 'please enter the edited title' }); return; }
    await Chapter.findByIdAndUpdate(_id, { title }, { new: true, runValidators: true })
        .then((sbj) => { res.status(200).json(sbj) })
        .catch(e => res.status(500).json({ message: e.message }))
}

const deleteChapter = async (req, res) => {
    const _id = req.params.id.toString().trim();
    if (!_id) { res.status(400).json({ message: 'id is required' }); return; }
    await Chapter.findByIdAndDelete(_id)
        .then(sbj => res.status(200).json({ message: 'deleted succussfully' }))
        .catch(e => console.log(e))
}

module.exports = {
    createChapter, getChapters, getChapter, editChapter, deleteChapter
}