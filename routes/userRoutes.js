const express = require('express');
const router = express.Router();
const User = require('../models/User');
router.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

router.post('/login', async (req, res) => {

    res.redirect('/');
});


router.get('/signup', (req, res) => {
    res.render('signup', { title: 'Sign Up' });
});


router.post('/signup', async (req, res) => {

    res.redirect('/');
});

module.exports = router;
