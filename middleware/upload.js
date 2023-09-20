const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        let fileName = file.originalname
        fileName = fileName.substr(0, fileName.indexOf('.')) + "_" + Date.now() + fileName.substr(fileName.indexOf("."))
        cb(null, fileName)
    }
})

var upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 },
})

module.exports = upload