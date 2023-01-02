const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ClinicModelSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);
 
const Clinic = mongoose.model('Clinic', ClinicModelSchema);
module.exports = Clinic;