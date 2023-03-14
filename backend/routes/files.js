const { fileHandler, getAllColumns, getData } = require("../controllers/files.js");
const multer = require('multer');
const express = require("express");
const util = require("util");
const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // The directory where uploaded files will be saved
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // The name of the uploaded file
    },
});

// const singleUpload = multer({ storage: storage }).array('file', 100);

const singleUpload = multer({ storage: storage }).array("file", 100);
var uploadFilesMiddleware = util.promisify(singleUpload);

router.post('/upload-csv', uploadFilesMiddleware, fileHandler);
router.post('/columns',uploadFilesMiddleware, getAllColumns);
router.get('/data', getData);

module.exports = router;
