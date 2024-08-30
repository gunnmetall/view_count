const express = require('express');
const connectDb = require('./configs/db');
const reportRoutes = require('./routes/reportRoutes');
const cors = require('cors');

// Initialize Express and Database
const app = express();
connectDb();

// Middleware
app.use(express.json());
app.use(cors()); // To allow cross-origin requests

// Routes
app.use('/api/reports', reportRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    res.status(500).json({ status: false, error: { message: err.message } });
});

// Start Server
const PORT = process.env.PORT || 8100;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
