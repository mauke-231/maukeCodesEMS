require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');
const { requireAuth, requireAdmin } = require('./middleware/authMiddleware');
const UserModel = require('./models/User'); // Ensure UserModel is imported
const Event = require('./models/Event'); // Ensure Event model is imported

const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = process.env.JWT_SECRET;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
   cors({
      credentials: true,
      origin: ['http://localhost:3000', 'https://maukecodesems.onrender.com'] // Add your frontend's origin here
   })
);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../../build'))); // Update the path to your build folder

// Ensure correct MIME type for CSS
app.use('/index.css', (req, res, next) => {
    res.setHeader('Content-Type', 'text/css');
    next();
});

// Add this after your middleware setup (after the cors configuration)
app.get("/", (req, res) => {
    res.json({ message: "Welcome to the Event Management System API" });
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});

// File upload configuration
const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, "uploads/");
   },
   filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
   }
});

const upload = multer({ storage });

// User registration route
app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
        const newUser = new UserModel({ email, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, jwtSecret, { expiresIn: '1h' });
        res.json({ token, user: newUser });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// User login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '1h' });
        res.json({ token, user });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Fetch events route
app.get('/events', requireAuth, async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../build/index.html')); // Update the path to your build folder
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
   console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
