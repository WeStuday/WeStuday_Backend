const Level = require('./../Models/levelModel')

const createLevel = async (req, res) => {
    const title = req.body.title
    let level = new Level({ title })
    await level.save()
        .then(newLevel => {
            return res.status(200).json(newLevel)
        })
        .catch(e => {
            return res.status(500).json({ message: e.message })
        })
}

const getLevels = async (req, res) => {
    Level.find({}).populate({ path: "grades" })
        .then((levels) => res.status(200).json(levels))
        .catch(e => res.status(500).json({ message: e.message }))
}

const getLevel = async (req, res) => {
    const _id = req.params.id.toString().trim();
    if (!_id) { res.status(400).json({ message: "id is required" }); return; }
    await Level.findById(_id).populate({ path: "grades" })
        .then(lvl => res.status(200).json(lvl))
        .catch(e => res.status(500).json({ message: e.message }))
}

const editLevel = async (req, res) => {
    const _id = req.params.id.toString().trim();
    const title = req.body.title;
    if (!_id) { res.status(400).json({ message: 'id is required' }); return; }
    if (!title) { res.status(400).json({ message: 'please enter the edited title' }); return; }
    await Level.findByIdAndUpdate(_id, { title }, { new: true, runValidators: true })
        .then((lvl) => { res.status(200).json(lvl) })
        .catch(e => res.status(500).json({ message: e.message }))
}

const deleteLevel = async (req, res) => {
    const _id = req.params.id.toString().trim();
    if (!_id) { res.status(400).json({ message: 'id is required' }); return; }
    await Level.findByIdAndDelete(_id)
        .then(lvl => res.status(200).json({ message: 'deleted succussfully' }))
        .catch(e => console.log(e))
}

module.exports = {
    createLevel, getLevels, getLevel, editLevel, deleteLevel
}