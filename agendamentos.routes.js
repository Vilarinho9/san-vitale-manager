const express = require('express')
const router = express.Router()
const agendamentosController = require('../controllers/agendamentos.controller')


router.get('/', agendamentosController.getAll)
router.get('/:id', agendamentosController.getById)
router.post('/', agendamentosController.create)
router.put('/:id', agendamentosController.update)
router.delete('/:id', agendamentosController.remove)

module.exports = router