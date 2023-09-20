const express = require('express')
const router = express.Router()
const gradeController = require('./../Controllers/gradeController')
const authenticate = require('./../middleware/verifyJWT')

router.post('/grade', authenticate, gradeController.createGrade)
router.get('/grade', authenticate, gradeController.getGrades)
router.get('/grade/:id', authenticate, gradeController.getGrade )
router.patch('/grade/:id', authenticate, gradeController.editGrade )
router.delete('/grade/:id', authenticate, gradeController.deleteGrade )

module.exports = router