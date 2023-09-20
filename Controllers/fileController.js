const fs = require("fs");
const path = require('path')
const Chapter = require('../Models/chapterModel')

const uploadFile = async (req, res) => {
  const chapterId = req.params.id;
  const filePath = req?.file?.path || null;

  try {
    if (!chapterId) { res.status(400).json({ message: 'chapter id is required' }); return; }
    if (!filePath) { res.status(400).json({ message: 'file is required' }); return; }
    const chapter = await Chapter.findById(chapterId);
    if (!chapter) { res.status(404).json({ message: "Chapter id not found" }); return; }
    chapter.files = [...chapter.files, filePath];
    await chapter.save();

    res.json({ message: "File uploaded successfully" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const downloadfile = async (req, res) => {
  const chapterId = req.body.chapterId;
  const index = req.body.index;

  try {
    if (!chapterId) { res.status(400).json({ message: 'chapterId is required' }); return; }
    if (!index) { res.status(400).json({ message: 'index is required' }); return; }
    const chapter = await Chapter.findById(chapterId);
    if (!chapter) { res.status(404).json({ message: "Chapter id not found" }); return; }

    console.log("File Path:", chapter.files);
    console.log("file: ", chapter?.files[index])
    if (!chapter?.files[index]) { res.status(404).json({ message: "this file index is not found" }); return; }
    if (!chapter.files[index]) { res.status(404).send("File not found"); return; }
    res.download(chapter.files[index]);
  } catch (e) {
    console.log("Error retrieving File:", e);
    res.status(500).json({ message: e.message });
  }
};

module.exports = {
  uploadFile,
  downloadfile,
};