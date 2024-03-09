import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
dotenv.config();

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
    }
    catch (error) {
        console.log(error);
    }
}

app.get("/", (req, res) => {
    res.send({ message: "Hello from server!" });
});

app.get("/tasks", (req, res) => {
    res.send({ message: "Hello from server!" });
});

const startServer = async () => {
    try {
        await connectDb();
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    }
    catch (error) {
        console.log(error);
    }
}

startServer();