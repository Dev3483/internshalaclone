const mongoose = require('mongoose');
require('dotenv').config();

const connect = () => {
    mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log('Database is connected');
        })
        .catch((err) => {
            console.error('Database connection error:', err);
        });
};

module.exports = { connect };
