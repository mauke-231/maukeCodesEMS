const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const UserModel = require("./models/User");
const Event = require("./models/Event");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const { requireAuth, requireAdmin } = require('./middleware/authMiddleware');

const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = process.env.JWT_SECRET;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
   cors({
      credentials: true,
      //origin: ['http://localhost:3000', 'http://192.168.8.141:3000'] // Add your frontend origins here
      origin: ['https://maukecodesems.onrender.com']
   })
);

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
      cb(null, file.originalname);
   },
});

const upload = multer({ storage });

// Public routes
app.post("/register", async (req, res) => {
   const { name, email, password } = req.body;
   
   try {
      console.log('Registration attempt:', { name, email });

      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
         console.log('Registration failed: Email already exists');
         return res.status(400).json({ error: 'Email already registered' });
      }

      const userDoc = await UserModel.create({
         name,
         email,
         password: bcrypt.hashSync(password, bcryptSalt),
         isAdmin: false
      });

      console.log('User registered successfully:', userDoc._id);
      res.status(201).json(userDoc);
   } catch (e) {
      console.error('Registration error:', e);
      res.status(422).json({ error: e.message });
   }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const userDoc = await UserModel.findOne({ email });
        if (!userDoc) {
            return res.status(404).json({ error: "User not found" });
        }

        const passOk = bcrypt.compareSync(password, userDoc.password);
        if (!passOk) {
            return res.status(401).json({ error: "Wrong password" });
        }

        jwt.sign(
            {
                email: userDoc.email,
                id: userDoc._id,
                name: userDoc.name,
                isAdmin: userDoc.isAdmin
            },
            jwtSecret,
            {},
            (err, token) => {
                if (err) throw err;
                res.cookie("token", token).json({
                    id: userDoc._id,
                    email: userDoc.email,
                    name: userDoc.name,
                    isAdmin: userDoc.isAdmin
                });
            }
        );
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/logout", (req, res) => {
   res.cookie("token", "").json({ message: "Logged out successfully" });
});

// Protected routes (require authentication)
app.use(requireAuth);

app.get("/profile", requireAuth, async (req, res) => {
    try {
        const user = await UserModel.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: "Failed to fetch profile" });
    }
});

app.get("/profile/rsvps", async (req, res) => {
    try {
        const events = await Event.find({ attendees: req.user._id });
        res.json(events);
    } catch (error) {
        console.error('Error fetching RSVP events:', error);
        res.status(500).json({ error: "Failed to fetch RSVP events" });
    }
});

app.post('/events/:id/cancel-rsvp', async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.user._id;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        event.attendees = event.attendees.filter(attendee => !attendee.equals(userId));
        await event.save();

        res.json({ message: 'RSVP cancelled successfully' });
    } catch (error) {
        console.error('Error cancelling RSVP:', error);
        res.status(500).json({ error: 'Failed to cancel RSVP' });
    }
});

// Event routes
app.get("/events", requireAuth, async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

app.get('/events/:id', requireAuth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch event details' });
    }
});

app.get("/events/category/:category", async (req, res) => {
   try {
      const { category } = req.params;
      const events = await Event.find({ 
         category: category === 'All' ? { $exists: true } : category 
      });
      res.json(events);
   } catch (error) {
      res.status(500).json({ error: "Failed to fetch events" });
   }
});

// Admin-only routes
app.post("/events", requireAdmin, upload.single("image"), async (req, res) => {
    try {
        const eventData = {
            ...req.body,
            image: req.file ? req.file.path : "",
            createdBy: req.user._id
        };
        const newEvent = await Event.create(eventData);
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(500).json({ error: "Failed to create event" });
    }
});

app.put("/events/:id", requireAdmin, async (req, res) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedEvent);
    } catch (error) {
        res.status(500).json({ error: "Failed to update event" });
    }
});

// Delete event (admin only)
app.delete('/events/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.json({ message: 'Event deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete event' });
    }
});

// Add RSVP functionality
app.post('/events/:id/rsvp', requireAuth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        const userId = req.user._id;
        
        // Initialize attendees array if it doesn't exist
        if (!event.attendees) {
            event.attendees = [];
        }

        // Check if user has already RSVP'd
        if (event.attendees.includes(userId)) {
            return res.status(400).json({ error: 'You have already RSVP\'d to this event' });
        }

        event.attendees.push(userId);
        await event.save();

        res.json({ message: 'RSVP successful' });
    } catch (error) {
        console.error('Error during RSVP:', error);
        res.status(500).json({ error: 'Failed to update RSVP' });
    }
});

// Add this route to your index.js file
app.get('/my-rsvps', requireAuth, async (req, res) => {
    try {
        const events = await Event.find({
            attendees: req.user._id
        }).sort({ eventDate: 1 });
        
        res.json(events);
    } catch (error) {
        console.error('Error fetching RSVPs:', error);
        res.status(500).json({ error: 'Failed to fetch RSVPs' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
   console.error(err.stack);
   res.status(500).json({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
   console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
