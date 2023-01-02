const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const DoctorModelSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);
 
const Doctor = mongoose.model('Doctor', DoctorModelSchema);
module.exports = Doctor;