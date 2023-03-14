const { fileHandler } = require("../controllers/files.js");
const multer = require('multer');
const express = require("express");
const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // The directory where uploaded files will be saved
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // The name of the uploaded file
    },
});

// const singleUpload = multer({ storage: storage }).single('newFile');

const singleUpload = multer({ storage: storage }).array("file", 100);
router.post('/upload-csv', singleUpload, fileHandler);
router.get('/columns', async (req, res) => {
    try {
        const columns = await Upload.distinct('file.columns');
        res.json({ columns });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error getting columns' });
    }
});

module.exports = router