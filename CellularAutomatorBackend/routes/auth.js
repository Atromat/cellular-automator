require("dotenv").config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const premadeRuleset = require('../PremadeRulesets');
const checkAuth = require('../middleware/tokenAuth');

const { JWT_SECRET } = process.env;

router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({ email, password });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        user.rulesets.push(premadeRuleset.gameOfLifeRuleset);
        user.rulesets.push(premadeRuleset.rule30Ruleset);

        await user.save();

        const payload = {
            user: { id: user.id }
        };

        jwt.sign(payload, JWT_SECRET, { expiresIn: 36000 }, 
        (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, JWT_SECRET, { expiresIn: 36000 }, 
        (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.delete('/unregister', checkAuth, async (req, res) => {
    try {
        const userId = req.userData.userId;
        console.log(userId)
        await User.findByIdAndDelete(userId);
        res.status(200).send('Successfully unregistered')
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;