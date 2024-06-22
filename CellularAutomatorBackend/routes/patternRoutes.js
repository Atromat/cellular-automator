require("dotenv").config();
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const checkAuth = require('../middleware/tokenAuth');

router.post('/pattern', checkAuth, async (req, res) => {
  try {
    const { rulesetId, ruleId, pattern } = req.body;
    const userId = req.userData.userId;
    const user = await User.findById(userId);

    if (user === null) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const ruleset = user.rulesets.id(rulesetId);
    const rule = ruleset.rules.id(ruleId);
    rule.patterns.push(pattern);

    await user.save();
    res.status(200).send({ rulesets: user.rulesets, ruleset: ruleset, rule: rule, pattern: rule.patterns[rule.patterns.length - 1] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.patch('/pattern', checkAuth, async (req, res) => {
  try {
    const { rulesetId, ruleId, pattern } = req.body;
    const userId = req.userData.userId;
    const user = await User.findById(userId);

    if (user === null) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const ruleset = user.rulesets.id(rulesetId);
    const rule = ruleset.rules.id(ruleId);
    const patternToUpdate = rule.patterns.id(pattern._id);
    for (const key in pattern) {
      patternToUpdate[key] = pattern[key];
    }

    await user.save();
    res.status(200).send({ rulesets: user.rulesets, ruleset: ruleset, rule: rule, pattern: patternToUpdate });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.delete('/pattern', checkAuth, async (req, res) => {
  try {
    const { rulesetId, ruleId, pattern } = req.body;
    const userId = req.userData.userId;
    const user = await User.findById(userId);

    if (user === null) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const ruleset = user.rulesets.id(rulesetId);
    const rule = ruleset.rules.id(ruleId);
    const patternIndex = rule.patterns.findIndex(p => p._id.toString() === pattern._id);

    if (patternIndex < 0) {
      return res.status(404).json({ msg: 'Pattern not found' });
    }

    rule.patterns.splice(patternIndex, 1);

    await user.save();
    res.status(200).send({ rulesets: user.rulesets, ruleset: ruleset, rule: rule });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;