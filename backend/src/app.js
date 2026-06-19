import 'dotenv/config'
import express from "express";
import cors from 'cors'
import { connectDB } from './config/connectDB.js';
const server = express();
//Router import
import categoryRouter from "./routers/category.router.js";
import roomRouter from "./routers/room.router.js";
import productRouter from "./routers/product.router.js"
//JSON Parser
server.use(express.json());
//Cors
server.use(cors({origin: "http://localhost:3000"}));
//Router use
server.use("/api/category", categoryRouter);
server.use("/api/room-type", roomRouter);
server.use("/api/product", productRouter);


connectDB().then(() => {
    server.listen(process.env.PORT,() => {
        console.log(`Server is running on port ${process.env.PORT}`)
    })
});