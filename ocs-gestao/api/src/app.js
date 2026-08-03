import  express from "express";
import routes from "./routes/index.js";
import db from "./config/dbConnect.js";
import dotenv from "dotenv";
import cors from "cors"

dotenv.config();
const app = express();

const allowedOrigins = (process.env.CORS_ORIGINS || "https://ocsgestao.com.br,http://localhost:4200")
    .split(",")
    .map(origin => origin.trim());

app.use(express.json());
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    }
}));
routes(app);

export default app;