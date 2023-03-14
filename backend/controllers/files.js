const mongoose = require("mongoose");
const Papa = require('papaparse');
const fs = require('fs');
const collect = require('collect.js');
const csv = require('csv-parser');

//Data schema 
const uploadSchema = new mongoose.Schema({
  name: String,
  file: {
    data: Buffer,
    contentType: String,
    originalName: String,
    columns: [String]
  },
});


// Creating Model of Schema
const Upload = mongoose.model('Upload', uploadSchema);

const readCSVFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.toString());
      }
    });
  });
};
const fileHandler = async (req, res) => {
  // console.log(req.files)

  const n = req.files.length;

  for (let i = 0; i < n; i++) {
    let name = req.files[i].filename;
    let file = req.files[i];

    let csv = await readCSVFile(`uploads/${name}`);
    let results = Papa.parse(csv, { header: true });
    let columns = results.meta.fields;

    const upload = new Upload({
      name,
      file: {
        data: file.buffer,
        contentType: file.mimetype,
        originalName: file.originalname,
        columns
      },
    });
    try {
      await upload.save();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error uploading file' });
    }

  }
  return res.json({ success: true });
};


const getAllColumns = async (req, res) => {
  try {
    console.log(req.body);
    var files = req.body;
    // console.log(files)
    const columns = [];

    var fileNames = Object.values(files);

    for (let i = 0; i < fileNames.length; i++) {
      const doc = await Upload.findOne({ name: fileNames[i] });
      const docCol = doc.file.columns;
      columns.push(...docCol)
    }

    console.log(columns);
    res.json({ columns });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error getting columns' });
  }
}

const getData = async (req, res) => {
  try {
    const query = req.query.queryColumn;
    const columnArr = query.split(",").map((c) => c.trim());
    const docs = [];

    for (let i = 0; i < columnArr.length; i++) {
      const doc = await Upload.findOne({ 'file.columns': { $in: columnArr[i] } });
      docs.push({
        fileName: doc.name,
        columnName: columnArr[i]
      });
    }
    const fileData = [];

    for (let i = 0; i < docs.length; i++) {
      const doc = docs[i];
      const filePath = `uploads/${doc.fileName}`;
      const csv = fs.readFileSync(filePath, 'utf-8');
      const records = csv.split('\n').map(row => row.split(','));
      const header = records[0];

      const columnIndices = [];
      for (let j = 0; j < header.length; j++) {
        if (doc.columnName === header[j].trim()) {
          columnIndices.push(j);
        }
      }
      const data = [];
      for (let j = 1; j < records.length; j++) {
        const row = records[j];
        const rowData = {};
        for (let k = 0; k < columnIndices.length; k++) {
          const columnIndex = columnIndices[k];
          
          if(row[columnIndex] !== undefined)
          rowData[header[columnIndex].trim()] = row[columnIndex].trim();
        }
        data.push(rowData);
      }

      fileData.push({
        fileName: doc.fileName,
        columnName: doc.columnName,
        data: data,
      });
    }

    return res.json({ fileData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error getting data' });
  }
}

module.exports = { fileHandler, getAllColumns, getData };


