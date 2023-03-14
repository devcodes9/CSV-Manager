import React, { useState } from 'react';
import axios from 'axios';
import './fileUpload.css';


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

        for (let i = 0; i < selectedFiles.length; i++) {
            formData.append('file', selectedFiles[i]);
            nameArr.push(selectedFiles[i].name);
        }

        try {
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
            <input  type="file" name="file" multiple onChange={handleFileInputChange} />
            <button onClick={handleUpload} className={'btn btnColumn'}>Upload</button>
            {alert ? <><div className={'succ'}><span className={'success'}>Uploaded succesfully</span></div><div style={{"marginBottom" : "15px" }}><button className={'btn btnColumn'} onClick={handleAvailable}>Show Available Columns</button></div></> : <><span></span></>}
            {/* {selectOpen && <div>{selectedColumns.map((column) => {
                return (<div key={column}>{column}</div>)
            })}</div>} */}

            {selectOpen && 
            <div>
            <table border="2" style={{ borderCollapse: "collapse", margin: "auto", "borderRadius": "12px", fontFamily: "Georgia, 'Times New Roman', Times, serif" }}>
                <thead>
                    <tr>
                        <th style={{"padding": "8px 20px"}}>Available Columns</th>
                    </tr>
                </thead>
                
                    {selectedColumns.map((column) => (
                        <tr><td style={{"padding": "8px 20px"}} key={column}>{column}</td></tr>
                    ))}
                
            </table>
            </div>}

            <h3>Search for data(comma separated column names)</h3>
            <input style={{padding: "8px 15px", marginLeft: "12px",  borderRadius: "15px", fontFamily: "Georgia"}} type="text" onChange={handleSearchQuery} placeholder="eg: Name, Age, Gender" />
            <button style={{padding: "8px 12px", marginLeft: "12px", borderRadius: "15px"}} className={"btn btnColumn"} onClick={handleGetData}>Get Data</button>
            
            <div className={'table'}>
            {openData && data !== undefined &&  (
                data.map((item) => {
                    return(<table border="1" style={{ borderCollapse: "collapse", "borderRadius": "12px", fontFamily: "Georgia, 'Times New Roman', Times, serif" }} >
                    <thead>
                        <tr>
                            <th style={{"padding": "8px 20px"}}>{item.columnName}</th>
                        </tr>
                    </thead>
                    {console.log(item)}
                    {item.data.map((val) => {
                        return (
                            <tbody>
                            <tr>
                                <td style={{"padding": "8px 20px"}}>{val[item.columnName]}</td>
                            </tr>
                            </tbody>
                        );
                    })}
                    
                </table>)
                })
                )}
            </div>
        </div >
    );
};

export default FileUploader;
