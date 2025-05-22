require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { generateShortCode } = require('./utils/shortCodeGenerator');
const Url = require('./models/Url');
const app = express();
const port = process.env.PORT || 3000;

// Get the base URL from environment variable or use default
const BASE_URL = process.env.BASE_URL || `http://localhost:${port}`;

// Function to get the correct base URL
const getBaseUrl = () => {
    if (process.env.BASE_URL) {
        return process.env.BASE_URL;
    }
    // For local development
    return `http://localhost:${port}`;
};

// Enable CORS with specific origin
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5000',
    credentials: true
}));

// Mongoose database connection
const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/urlshortener';

mongoose.connect(dbUri)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Could not connect to MongoDB:', err));
// -- End of Mongoose DB connection

app.use(express.json());
app.use(express.static('public'));

app.get("/", (req, res) => {
    res.send("Welcome to URL Shortener API.");
});

// Create short URL
app.post('/shorten', async (req, res) => {
    try {
        const longUrl = req.body.url;
        // Basic validation for longUrl
        if (!longUrl) {
            return res.status(400).json({ error: 'The url is missing or empty. Please check again' });
        }
        // Check if the long URL already exists in the database
        const existingUrl = await Url.findOne({ longUrl: longUrl });
        if (existingUrl) {
            return res.status(200).json({
                longUrl: existingUrl.longUrl,
                shortUrl: `${BASE_URL}/${existingUrl.shortCode}`,
            });
        }
        const shortCode = await generateShortCode()
        // Create a new URL document
        const newUrl = new Url({
            longUrl: longUrl,
            shortCode: shortCode // Generate a new unique short code
        });
        // Save the document to the database
        await newUrl.save();
        // Send success response
        return res.status(201).json({
            longUrl: newUrl.longUrl,
            shortUrl: `${BASE_URL}/${newUrl.shortCode}`,
        });
    } catch (error) {
        console.error(`Error shortening URL: ${error}`);
        if (error.name === 'ValidationError') {
            // This error comes from Mongoose schema validation 
            const errors = Object.keys(error.errors).map(key => error.errors[key].message);
            return res.status(400).json({ error: 'Validation failed', details: errors });
        }
        // Unique key errors handler
        if (error.code === 11000) {
            return res.status(409).json({ error: 'Short code collision (please try again)' });
        }

        // Generic server error
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Retrieve Original URL
app.get('/shorten/:shortCode', async (req, res) => {
    try {
        const shortCode = req.params.shortCode;
        const urlEntry = await Url.findOne({ shortCode: shortCode });
        if (!urlEntry) {
            return res.status(404).json({ error: "Short URL not found." })
        }
        const updatedUrlEntry = await Url.findByIdAndUpdate(
            urlEntry._id,
            { $inc: { clicks: 1 }, $set: { lastAccessedAt: new Date() } },
            { new: true }
        )
        return res.redirect(updatedUrlEntry.longUrl).json({
            id: updatedUrlEntry._id,
            url: updatedUrlEntry.longUrl,
            shortCode: updatedUrlEntry.shortCode,
            createdAt: updatedUrlEntry.createdAt,
            updatedAt: updatedUrlEntry.lastAccessedAt
        });
    } catch(error) {
        console.error(`Error shortening URL: ${error}`);
        if (error.name === 'ValidationError') {
            // This error comes from Mongoose schema validation 
            const errors = Object.keys(error.errors).map(key => error.errors[key].message);
            return res.status(400).json({ error: 'Validation failed', details: errors });
        }
        // Unique key errors handler
        if (error.code === 11000) {
            return res.status(409).json({ error: 'Short code collision (please try again)' });
        }

        // Generic server error
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update Short URL
app.put('/shorten/:shortCode', async (req, res) => {
    try {
        const shortCode = req.params.shortCode;
        const newLongUrl = req.body.url;
        const url = await Url.findOne({ shortCode: shortCode });
        if (!url) {
            return res.status(404).json({ error: "Short URL not found."});
        }
        const updatedUrlEntry = await Url.findByIdAndUpdate(
            url._id,
            { $set: { longUrl: newLongUrl }},
            { new: true }
        )
        return res.status(200).json({
            id: updatedUrlEntry._id,
            url: updatedUrlEntry.longUrl,
            shortCode: updatedUrlEntry.shortCode,
            createdAt: updatedUrlEntry.createdAt,
            lastAccessedAt: updatedUrlEntry.lastAccessedAt
        })
    } catch(error) {
        console.error(`Error shortening URL: ${error}`);
        if (error.name === 'ValidationError') {
            // This error comes from Mongoose schema validation 
            const errors = Object.keys(error.errors).map(key => error.errors[key].message);
            return res.status(400).json({ error: 'Validation failed', details: errors });
        }
        // Unique key errors handler
        if (error.code === 11000) {
            return res.status(409).json({ error: 'Short code collision (please try again)' });
        }

        // Generic server error
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Delete Short URL
app.delete('/shorten/:shortCode', async (req, res) => {
    try {
        const shortCode = req.params.shortCode;
        const url = await Url.findOne({ shortCode: shortCode });
        if (!url) {
            return res.status(404).json({ error: "Short URL not found."});
        }
        const deleteEntry = await Url.deleteOne({ shortCode: shortCode });
        return res.status(204).send();

    } catch (error) {
        console.error(`Error shortening URL: ${error}`);
        if (error.name === 'ValidationError') {
            // This error comes from Mongoose schema validation 
            const errors = Object.keys(error.errors).map(key => error.errors[key].message);
            return res.status(400).json({ error: 'Validation failed', details: errors });
        }
        // Unique key errors handler
        if (error.code === 11000) {
            return res.status(409).json({ error: 'Short code collision (please try again)' });
        }

        // Generic server error
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get URL Statistic
app.get('/shorten/:shortCode/stats', async (req, res) => {
    try {
        const shortCode = req.params.shortCode;
        const url = await Url.findOne({ shortCode: shortCode });
        if (!url) {
            return res.status(404).json({ error: "Short URL not found." })
        }
        return res.status(200).json({
            longUrl: url.longUrl,
            shortUrl: url.shortCode,
            clicks: url.clicks,
            createdAt: url.createdAt,
            lastAccessedAt: url.lastAccessedAt
        })
    } catch(error) {
        console.error(`Error shortening URL: ${error}`);
        if (error.name === 'ValidationError') {
            // This error comes from Mongoose schema validation 
            const errors = Object.keys(error.errors).map(key => error.errors[key].message);
            return res.status(400).json({ error: 'Validation failed', details: errors });
        }
        // Unique key errors handler
        if (error.code === 11000) {
            return res.status(409).json({ error: 'Short code collision (please try again)' });
        }

        // Generic server error
        res.status(500).json({ error: 'Internal Server Error' });
    }
})
app.listen(port, () => {
    console.log(`Server listening at ${getBaseUrl()}`);
});
