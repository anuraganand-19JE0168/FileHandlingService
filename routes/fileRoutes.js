const express = require('express');
const router = express.Router();

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const fileController= require('../controllers/fileController');

router.get('/', function (req, res) {
    console.log(req.body);
    res.json({
        success: true,
        message: "Backend Working fine"
    });
});
router.post('/:_id', upload.single("file"), fileController.fileUpload);

router.get('/:_id', fileController.fileDownload);

router.delete('/:_id', fileController.fileDelete);

module.exports = router;