
# OneAssure CSV Manager

Created a basic web application which:

-Accepts one or more CSV files as an input and stores in a database.

-Reads the CSV file and returns the output of all the available column names in all the CSV files.

-Accepts column-specific filters to fetch fields that match the queries.





## API Reference

#### Post one or more CSV files

```http
  POST http://localhost:8080/api/v1/upload-csv
```
#### fileHandler(req, res)                  
  ##### Reads the csv files you upload and saves it in MongoDB database

| Input | Output     | Description                |
| :-------- | :------- | :------------------------- |
| `form-data` | `success: true` | **Required**."Content-Type": "multipart/form-data"|

Warning: csv file size should be < 1 mb
  
--------
#### Post the names of CSV files 

```http
  POST http://localhost:8080/api/v1/columns
```
#### getAllColumns(req, res)
##### To get all the available column names from files when files are uploaded.
| Input | Output     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `filename Array`      | ` Columns` | **Required**."Content-Type": "multipart/form-data" |

    example output: ["seller_id","profit","loss","order_id","delivered"] 
-----------
#### Get the names of specific columns

```http
  GET http://localhost:8080/api/v1/data?queryColumn=${queryColumn}
```
#### getData(req, res)
##### To get fields that match the queries using column specific filter.

| Input | Output     | Description                       |
| :-------- | :------- | :-------------------------------- |
| ``      | `Array` | **Required** : column names as query |
     Example output for get request of : localhost:8080/api/v1/data?queryColumn=seller_id,order_id
    {
            "fileName": "sellers.csv",
            "columnName": "seller_id",
            "data": [
                {
                    "seller_id": "1"
                },
                {
                    "seller_id": "2"
                }
            ]
        },
        {
            "fileName": "sales.csv",
            "columnName": "order_id",
            "data": [
                {
                    "order_id": "1"
                },
                {
                    "order_id": "2"
                }
            ]
        }
    ]
--------

## Installation

Install the frontend with npm

```bash
  cd frontend
  npm install 
  npm start
```

Install the backend with npm

```bash
  cd backend
  npm install 
  node index.js
```
-------

## Demo
![CPT2303141817-1523x733](https://user-images.githubusercontent.com/81856196/225006267-c8dd7750-9222-45ab-9c0c-bba83e5bfa95.gif)

