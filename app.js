const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.static('public'));


const MONGODB_URI = "mongodb+srv://Suhani:SuhaniWebDev@cluster0.1szso.mongodb.net/LineUp";

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));


const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = mongoose.model('User', userSchema, 'User');

const eventSchema = new mongoose.Schema({ url: String, caption: String });
const clubSchema = new mongoose.Schema({ logo: String, name: String });


const RecentEvents = mongoose.model('RecentEvents', eventSchema);
const UpcomingEvents = mongoose.model('UpcomingEvents', eventSchema);

const Clubs = mongoose.model('Clubs', clubSchema);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
    try {

        const recentEvents = await RecentEvents.find({});
        const upcomingEvents = await UpcomingEvents.find({});
        const clubs = await Clubs.find({});
        
        console.log('Recent Events:', recentEvents);
        console.log('Upcoming Events:', upcomingEvents);
        console.log('Clubs:', clubs);
        
        res.render('homepage', { recentEvents, upcomingEvents, clubs });
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Error loading data');
    }
});

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/login', (req, res) => {
    res.render('login', { errorMessage: null }); 
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email, password });

        if (user) {
            res.redirect('/'); 
        } else {
            res.render('login', {
                errorMessage: "Invalid email or password. Please try again.",
            });
        }
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/login', (req, res) => {
    res.render('login', { username: 'Guest', loggedIn: false });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
const LikedEventsSchema = new mongoose.Schema({
    title: String,
    venue: String,
    date: String,
    time: String,
    image: String,
    isLiked:Boolean

});

const LikedEvent = mongoose.model('LikedEvents', LikedEventsSchema, 'LikedEvents');

app.post('/toggle-like', async (req, res) => {
    try {
        const { title, eventDetails } = req.body;
        console.log('Toggle like for event:', title);

        // Check if event exists in LikedEvents collection
        const existingEvent = await LikedEvent.findOne({ title });

        if (existingEvent) {
            
            existingEvent.isLiked = false;  
            await existingEvent.save();
            console.log('Event unliked:', existingEvent); 
            return res.json({ status: 'unliked' }); 
        }

       
        const newEvent = new LikedEvent({ ...eventDetails, isLiked: true });
        await newEvent.save();
        console.log('Event liked:', newEvent);  

        res.json({ status: 'liked' }); 
    } catch (err) {
        console.error('Error toggling like:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/liked-events', async (req, res) => {
    try {
        const likedEvents = await LikedEvent.find({ isLiked: true });
        res.render('likedevents', { likedEvents });
    } catch (err) {
        console.error('Error fetching liked events:', err);
        res.status(500).send('Error loading liked events');
    }
});

app.get('/event/:caption', async (req, res) => {
    try {
        const { caption } = req.params;
        const event = await RecentEvents.findOne({ caption }) || await UpcomingEvents.findOne({ caption });

        if (!event) {
            return res.status(404).send('Event not found');
        }

        
        res.render('EventDetails', { event });
    } catch (err) {
        console.error('Error fetching event details:', err);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/signup', (req, res) => {
    res.render('signup', { errorMessage: null }); // Render signup page with no error initially
});

app.post('/signup', async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    try {
        // Check if the email already exists in the database
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('signup', {
                errorMessage: "User with this email already exists. Please log in or use a different email.",
            });
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.render('signup', {
                errorMessage: "Passwords do not match. Please try again.",
            });
        }

        // Create a new user and save to the database
        const newUser = new User({ username, email, password });
        await newUser.save();

        res.redirect('/'); // Redirect to the homepage on successful signup
    } catch (err) {
        console.error('Error during sign-up:', err);
        res.status(500).send('Internal Server Error');
    }
});