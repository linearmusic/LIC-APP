const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();
PORT=process.env.PORT || 3000

// Updated CORS configuration
const allowedOrigins = [
    'http://localhost:5173',    // Local development
    'https://lic-app-eight.vercel.app' // Fixed: removed trailing slash
];

const app = express();
app.use(cors({
    origin: function(origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if(!origin) return callback(null, true);
        if(allowedOrigins.indexOf(origin) === -1){
            var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something broke!" });
});

const { adminRouter } = require("./Routes/admin");

app.use("/admin", adminRouter);

async function main() {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to MongoDB");
        app.listen(PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });
    } catch (err) {
        console.error("MongoDB connection failed:", err.message);
    }
}
main();