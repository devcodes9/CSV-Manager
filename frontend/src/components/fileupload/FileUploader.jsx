import React, { useState } from 'react';
import Papa from 'papaparse';
import axios from 'axios';

const FileUploader = () => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [alert, setalert] = useState(false)

    const handleFileInputChange = (e) => {
        const { files } = e.target;
        setSelectedFiles(files);
        console.log(files)
    };

    const handleUpload = async () => {
        const formData = new FormData();

        // Loop through each selected file and append it to the FormData object
        for (let i = 0; i < selectedFiles.length; i++) {
            formData.append('file', selectedFiles[i]);
        }

        try {
            // Make a POST request to the backend API to store the data in the database
            const config = {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            };

            const response = await axios.post('http://localhost:8080/api/v1/upload-csv', formData, config);

            if (response.data.success === true) {
                setalert(true);
            }
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <input type="file"  name="file" multiple onChange={handleFileInputChange} />
            <button onClick={handleUpload}>Upload</button>
            {alert ? <><span>Uploaded succesfully</span></> : <><span></span></>}
        </div>
    );
};

export default FileUploader;
