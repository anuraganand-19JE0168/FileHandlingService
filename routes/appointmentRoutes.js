const express = require('express');
const router = express.Router();


const appointmentController = require('../controllers/appointmentController');

router.post('/:_id', appointmentController.addAppointment);

router.get('/:_id', appointmentController.getAppointment);

module.exports = router;