import cors from "cors"
import dotenv from 'dotenv'
import express from 'express'
import cookieParser from 'cookie-parser'
import { connectDb } from './config/database.js'
import { configSocket } from './config/socket.js'
import { configCloudinary } from './config/cloudinary.js'

// import routes
import artRoutes from './routes/artRoutes.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
import subscriberRoutes from './routes/subscriberRoutes.js'

// import error middleware
import ErrorMiddleware from './middleware/errorMiddleware.js'

// dot env
dotenv.config({ path: './.env' });

// express app
const app = express();
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    credentials: true,
    origin: ["http://localhost:5173", process.env.CLIENT_URL],
}));

// configuration of database, cloudinary
connectDb();
configSocket();
configCloudinary();

// server listening
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Listening in port ${PORT}`));

// routes
app.get("/", (req, res) => { res.send("Hello from server!"); })
app.use("/api/v1", authRoutes)
app.use("/api/v1", userRoutes)
app.use("/api/v1", artRoutes)
app.use("/api/v1", chatRoutes)
app.use("/api/v1", paymentRoutes)
app.use("/api/v1", orderRoutes)
app.use("/api/v1", adminRoutes)
app.use("/api/v1", subscriberRoutes)

// error middleware
app.use(ErrorMiddleware);