const mongoose = require('mongoose');
const DB_CONNECTION_STRING = 'mongodb://localhost:27017/reports';

const connectDb = async () => {
    try {
        await mongoose.connect(DB_CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Database connected');
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
};

module.exports = connectDb;
