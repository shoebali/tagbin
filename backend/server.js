// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');
dotenv.config();
connectDB();
// const generateAccessKey = () => {
//     return crypto.randomBytes(16).toString('hex'); // Generates a random 32-character hex string
// };
// const accessKey = generateAccessKey();
// console.log(`Your generated access key is: ${accessKey}`);


const app = express();
app.use(cors());
app.use(express.json());
app.use('/resume/uploads', express.static(path.join(__dirname, 'public')));
app.get('/resume/uploads/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    const imagePath = `${__dirname}/public/uploads/${imageName}`;
    res.sendFile(imagePath, (err) => {
        if (err) {
            console.error('Error serving image:', err);
            res.status(err.status).end();
        }
    });
});
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
// app.use('/api/jobs', jobRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
