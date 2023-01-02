const File = require('../models/FileModel');
const Patient = require('../models/PatientModel');
const Doctor = require('../models/DoctorModel');
const Clinic = require('../models/ClinicModel');
const Path = require('path');
var AWS = require("aws-sdk");

exports.fileUpload = async (req, res, next) => {
    try {
        const {fileType, userType} = req.body;
        const _id = req.params._id;
        var isValidUser = false;
        if(userType == "Patient")
        {
            isValidUser = await Patient.findOne({_id : _id});
        }
        else if(userType == "Doctor")
        {
            isValidUser = await Doctor.findOne({_id :  _id});
        }
        else if(userType == "Clinic")
        {
            isValidUser = await Clinic.findOne({_id : _id});
        }
        if(isValidUser)
        {
            const file = req.file;
            if(!file)
            {
                return res.status(400).send("File not attatched");
            }
            
            if(!userType || !fileType)
            {
                return res.status(400).send("File type and User type required");
            }

            const s3FileURL = process.env.AWS_Uploaded_File_URL_LINK;

            let s3bucket = new AWS.S3({
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                region: process.env.AWS_REGION
            });

            var params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: 'File/' + Date.now().toString(),
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: "public-read"
            };

            //upload to s3 bucket.
            s3bucket.upload(params, function(error, data) {
                if (error) {
                    console.log(error);
                    return res.status(400).json({
                        success: false,
                        message: "Error in uploading file"
                    })
                }
                else {
                    var newFile = new File({
                        fileType: fileType,
                        fileUrl: s3FileURL + params.Key,
                        fileS3_Key: params.Key,
                        user: { _id: _id , userType: userType},
                    })
                    File.create(newFile, function(error, item){
                        if(error){
                            console.log(error);
                            return res.status(400).json({
                                success: false,
                                message: "Error in saving in database"
                            });
                        }      
                        else{
                            console.log("Successfully Created File");
                            res.json({
                                success: true,
                                message: "Successfully Created File"
                            });
                        }
                    });               
                }
            });
        }
        else
        {
            res.status(400).send("User not registered");
        }
    } catch (error) {
        console.log(error);
    }
}


exports.fileDownload = async (req, res, next) =>{
    try {
        const {userType, fileS3_Key} = req.body;
        const _id = req.params._id;
        var isValidUser = false;
        if(userType == "Patient")
        {
            isValidUser = await Patient.findOne({_id : _id});
        }
        else if(userType == "Doctor")
        {
            isValidUser = await Doctor.findOne({_id :  _id});
        }
        else if(userType == "Clinic")
        {
            isValidUser = await Clinic.findOne({_id : _id});
        }
        if(isValidUser)
        {
            let s3bucket = new AWS.S3({
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                region: process.env.AWS_REGION
            });

            var options = {
                Bucket    : process.env.AWS_BUCKET_NAME,
                Key    : fileS3_Key,
            };
            res.attachment(fileS3_Key);
            var fileStream = s3bucket.getObject(options).createReadStream();
            fileStream.pipe(res);
        }
        else
        {
            res.status(400).send("User not registered");
        }
    } catch (error) {
        console.log(error);
    }
}

exports.fileDelete = async (req, res, next) =>{
    try {
        const {userType, fileS3_Key} = req.body;
        const _id = req.params._id;
        var isValidUser = false;
        if(userType == "Patient")
        {
            isValidUser = await Patient.findOne({_id : _id});
        }
        else if(userType == "Doctor")
        {
            isValidUser = await Doctor.findOne({_id : _id});
        }
        else if(userType == "Clinic")
        {
            isValidUser = await Clinic.findOne({_id : _id});
        }
        if(isValidUser)
        {
            const fileExists = await File.findOne({fileS3_Key: fileS3_Key});
            if(!fileExists)
            {
                return res.status(400).send("File not found in database");
            }
            if(fileExists.user._id != _id)
            {
                return res.status(400).send("Invalid user");
            }

            await File.deleteOne({_id: fileExists});
            let s3bucket = new AWS.S3({
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                region: process.env.AWS_REGION
            });

            var options = {
                Bucket    : process.env.AWS_BUCKET_NAME,
                Key    : fileS3_Key,
            };
            s3bucket.deleteObject(options, function(err, data) {
                if (err) console.log(err, err.stack);
                else console.log();  
            })
            return res.json({
                success: true,
                message: "Successfully Deleted File"
            });
        }
        else
        {
            res.status(400).send("User not registered");
        }
    } catch (error) {
        console.log(error);
        
    }
}