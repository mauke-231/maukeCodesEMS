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
app.use(cookieParser());
app.use(
   cors({
      credentials: true,
      origin: ['http://localhost:3000', 'https://campus-backend-oxyd.onrender.com']
   })
);

// Add this after your middleware setup (after the cors configuration)
app.get("/", (req, res) => {
    res.json({ message: "Welcome to the Event Management System API" });
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Successfully connected to MongoDB Atlas');
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
        process.exit(1);
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

app.get("/profile", async (req, res) => {
   res.json(req.user);
});

// Event routes
app.get("/events", async (req, res) => {
   try {
      const events = await Event.find().populate('createdBy', 'name');
      res.json(events);
   } catch (error) {
      res.status(500).json({ error: "Failed to fetch events" });
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

app.delete("/events/:id", requireAdmin, async (req, res) => {
   try {
      await Event.findByIdAndDelete(req.params.id);
      res.json({ message: "Event deleted successfully" });
   } catch (error) {
      res.status(500).json({ error: "Failed to delete event" });
   }
});

// Add these routes after your existing routes

// Get all events
app.get('/events', async (req, res) => {
    try {
        const events = await Event.find()
            .sort({ eventDate: 1 }); // Sort by date ascending
        res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

// Get events by category
app.get('/events/category/:category', async (req, res) => {
    try {
        const events = await Event.find({ 
            category: req.params.category 
        }).sort({ eventDate: 1 });
        res.json(events);
    } catch (error) {
        console.error('Error fetching events by category:', error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

// Get single event by ID
app.get('/events/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ error: 'Failed to fetch event' });
    }
});

// Create new event (admin only)
app.post('/events', requireAuth, requireAdmin, async (req, res) => {
    try {
        console.log('Received event data:', req.body); // Add logging
        console.log('User creating event:', req.user); // Add logging

        const eventData = {
            ...req.body,
            createdBy: req.user._id
        };

        console.log('Processed event data:', eventData); // Add logging

        const newEvent = await Event.create(eventData);
        console.log('Created event:', newEvent); // Add logging
        res.status(201).json(newEvent);
    } catch (error) {
        console.error('Detailed error:', error); // Add detailed error logging
        res.status(500).json({ 
            error: 'Failed to create event',
            details: error.message 
        });
    }
});

// Update event (admin only)
app.put('/events/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedEvent) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.json(updatedEvent);
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ error: 'Failed to update event' });
    }
});

// Delete event (admin only)
app.delete('/events/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);
        if (!deletedEvent) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
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

        // Convert ObjectIds to strings for comparison
        const userIdStr = userId.toString();
        const isAttending = event.attendees.some(id => id.toString() === userIdStr);

        if (isAttending) {
            // Remove user from attendees
            event.attendees = event.attendees.filter(id => id.toString() !== userIdStr);
            console.log('User removed from attendees');
        } else {
            // Check capacity before adding
            if (event.attendees.length >= event.capacity) {
                return res.status(400).json({ error: 'Event is fully booked' });
            }
            // Add user to attendees
            event.attendees.push(userId);
            console.log('User added to attendees');
        }

        await event.save();
        
        res.json({
            success: true,
            message: isAttending ? 'RSVP cancelled' : 'RSVP confirmed',
            event,
            spotsRemaining: event.capacity - event.attendees.length
        });
    } catch (error) {
        console.error('RSVP error:', error);
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
