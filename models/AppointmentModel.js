const mongoose = require('mongoose');
const Clinic = require('./ClinicModel');
const Doctor = require('./DoctorModel');
const Patient = require('./PatientModel');
const Schema = mongoose.Schema;
const AppointmentModelSchema = new Schema(
    {
        clinicId: {
            type: Schema.Types.ObjectId,
            ref: Clinic,
            required: true
        },
        doctorId: {
            type: Schema.Types.ObjectId,
            ref: Doctor,
            required: true
        },
        patientId: {
            type: Schema.Types.ObjectId,
            ref: Patient,
            required: true
        },
        appointmentDate: {
            type: date,
            required: true
        }
    },
    { timestamps: true }
);
 
const Appointment = mongoose.model('Appointment', AppointmentModelSchema);
module.exports = Appointment;