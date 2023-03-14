import React, { useState } from 'react';
import Papa from 'papaparse';
import axios from 'axios';

const FileUploader = () => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [alert, setalert] = useState(false)
    const [selectedColumns, setSelectedColums] = useState([]);
    const [selectOpen, setselectOpen] = useState(false);
    const [queryColumn, setQueryColumn] = useState('');
    const [data, setData] = useState([]);
    const [openData, setopenData] = useState(false);

    const handleFileInputChange = (e) => {
        const { files } = e.target;
        setSelectedFiles(files);
        console.log(files)
    };

    const handleUpload = async () => {
        const formData = new FormData();
        let nameArr = [];
        // Loop through each selected file and append it to the FormData object
        for (let i = 0; i < selectedFiles.length; i++) {
            formData.append('file', selectedFiles[i]);
            // console.log(selectedFiles[i]);
            nameArr.push(selectedFiles[i].name);
        }

        // console.log(nameArr)

        try {
            // Make a POST request to the backend API to store the data in the database
            const config = {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            };

            const response = await axios.post('http://localhost:8080/api/v1/upload-csv', formData, config);
            const response2 = await axios.post('http://localhost:8080/api/v1/columns', nameArr, config);


            console.log(response.data);
            const { columns } = response2.data;
            setSelectedColums(columns);
            console.log(columns);
            if (response.data.success === true) {
                setalert(true);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleAvailable = (e) => {
        e.preventDefault();
        setselectOpen(true);
    }

    const handleSearchQuery = (e) => {
        setQueryColumn(e.target.value);
    }
    const handleGetData = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/api/v1/data?queryColumn=${queryColumn}`);
            const docs = res.data.fileData;
            setData(docs);
            console.log(docs)
            setopenData(true);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <input type="file" name="file" multiple onChange={handleFileInputChange} />
            <button onClick={handleUpload}>Upload</button>
            {alert ? <><span>Uploaded succesfully</span><div><button onClick={handleAvailable}>Show Available Columns</button></div></> : <><span></span></>}
            {/* {selectOpen && <div>{selectedColumns.map((column) => {
                return (<div key={column}>{column}</div>)
            })}</div>} */}

            {selectOpen && <div><table border="2" style={{ borderCollapse: "collapse", margin: "auto" }}>
                <thead>
                    <tr>
                        <th>Columns</th>
                    </tr>
                </thead>
                <tr>
                    {selectedColumns.map((column) => (
                        <tr><td key={column}>{column}</td></tr>
                    ))}
                </tr>
            </table>
            </div>}

            <h3>Search for data(comma separated column names)</h3>
            <input type="text" onChange={handleSearchQuery} placeholder="eg: Name, Age, Gender" />
            <button onClick={handleGetData}>Get Data</button>
            {openData && (
                <table>
                    <thead>
                        <tr>
                            <th>File Name</th>
                            <th>Column Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data !== undefined && data.map((item) => (
                            <tr key={item.fileName + item.columnName}>
                                <td>{item.fileName}</td>
                                <td>{item.columnName}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div >
    );
};

export default FileUploader;
