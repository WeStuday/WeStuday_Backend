const express = require('express')
const router = express.Router()
const subjectController = require('./../Controllers/subjectController')
const authenticate = require('./../middleware/verifyJWT')

router.post('/subject',authenticate, subjectController.createSubject)
router.get('/subject', authenticate, subjectController.getSubjects)
router.get('/subject/:id', authenticate, subjectController.getSubject)
router.patch('/subject/:id', authenticate, subjectController.editSubject)
router.delete('/subject/:id', authenticate, subjectController.deleteSubject)

module.exports = router