const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Patient = require('./PatientModel');
const FileModelSchema = new Schema(
    {
        fileType: {
            // prescription, report, patient history doc
            type: String,
            trim: true,
            default: ''
        },
        fileUrl: {
            type:  String,
            trim: true,
            default: ''            
        },
        fileS3_Key: {
            type:  String,
            trim: true,
            default: ''            
        },
        user: {
            _id: {
                type: Schema.Types.ObjectId,
                required: true
            },
            userType: {
                type: String,
                required: true
            }
        },
        allowedUsers: [
            {
                userId: {
                    type: Schema.Types.ObjectId,
                }
            }
        ]
        //user can voluntarily provide access. Doctor can request for access
    },
    { timestamps: true }
);
 
const File = mongoose.model('File', FileModelSchema);
module.exports = File;