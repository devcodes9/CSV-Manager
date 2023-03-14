const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const fileRouter = require("./routes/files.js")
// const cookieParser = require("cookie-parser");
var cors = require('cors')

const app = express();
dotenv.config();

app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
);

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to Database!");
    } catch (error) {
        throw error;
    }
}

mongoose.connection.on("disconnected", () => {
    console.log("MongoDB disconnected");
});

mongoose.connection.on("connected", () => {
    console.log("MongoDB connected");
});

//midllewares
// app.use(cookieParser());
app.use(express.json());
app.use("/api/v1", fileRouter)
app.use((error, req, res, next) => {
    console.log('This is the rejected field ->', error.field);
  });
app.listen(8080, () => {
    connect();
    console.log("Listening on port 8080!");
})