const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PatientModelSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);
 
const Patient = mongoose.model('Patient', PatientModelSchema);
module.exports = Patient;