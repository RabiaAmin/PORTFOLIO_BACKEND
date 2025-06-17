import express from "express"
import dotenv from "dotenv"
import cors from 'cors'
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import dbConnection from "./config/mongodb.js";
import { errorMiddleware } from "./middleware/error.js";
import userRoute from "./routes/userRoute.js";
import userSkillRouter from "./routes/skillRoute.js"
import userProjectRouter from "./routes/projectRoute.js"
const app = express();

dotenv.config({path: "./.env"});

app.use(cors({
    origin:[process.env.PORFOLIO_URL,process.env.DASHBOARD_URL],
    methods: ['GET','POST','PUT','DELETE'],
    credentials: true,
}));

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
}));

app.use("/api/v1/user",userRoute);
app.use("/api/v1/skills",userSkillRouter);
app.use("/api/v1/project",userProjectRouter);

dbConnection();
app.use(errorMiddleware);



export default app;