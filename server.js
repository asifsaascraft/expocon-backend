// Configure DNS first
import "./config/dns.js";

import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";

import swaggerRoutes from "./routes/swaggerRoutes.js";
import authRoutes from "./routes/authRoutes.js";

// Connect Database
await connectDB();

const app = express();

// Allowed Origins
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  process.env.FRONTEND_URL,
];

// CORS Configuration
// const corsOptions = {
//   origin(origin, callback) {
//     if (!origin) {
//       return callback(null, true);
//     }

//     if (allowedOrigins.includes(origin)) {
//       return callback(null, true);
//     }

//     return callback(new Error("Not allowed by CORS."));
//   },

//   credentials: true,
// };

// CORS for now all origin allowed for testing
const corsOptions = {
  origin: (origin, callback) => {
    // allow any origin (including browser requests)
    callback(null, true);
  },
  credentials: true,
};

// Global Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

// Middlewares
app.use(helmet());
app.use(compression());
app.use(cors(corsOptions));
app.use(limiter);

app.use(express.json({
  limit: "10mb",
}));

app.use(express.urlencoded({
  extended: true,
  limit: "10mb",
}));

app.use(cookieParser());

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}


// Swagger
app.use("/api-docs", swaggerRoutes);

// =======================
// Health check
// =======================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Expocon Backend API",
    company: "SaaScraft Studio (India) Pvt. Ltd.",
    version: "1.0.0",
  });
});

// =======================
// API Routes
// =======================
app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/partners", partnerRoutes);
// app.use("/api/staff", staffRoutes);
// app.use("/api/events", eventRoutes);


// 404 Route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err);

  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error.",
  });
});


// =======================
// Start server
// =======================


const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
