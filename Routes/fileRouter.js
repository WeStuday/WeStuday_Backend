const express = require('express')
const router = express.Router()
const fileController = require('./../Controllers/fileController')
const authenticate = require('./../middleware/verifyJWT')
const upload = require('./../middleware/upload')

router.post('/upload/:id', authenticate, upload.single("file"), fileController.uploadFile)
router.get('/download', authenticate, fileController.downloadfile)

module.exports = router