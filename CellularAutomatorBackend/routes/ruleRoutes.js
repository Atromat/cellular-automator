require("dotenv").config();
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const checkAuth = require('../middleware/tokenAuth');

router.post('/rule', checkAuth, async (req, res) => {
  try {
    const { rulesetId, rule } = req.body;
    const userId = req.userData.userId;
    const user = await User.findById(userId);

    if (user === null) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const ruleset = user.rulesets.id(rulesetId);

    if (!(ruleset.cellTypes.some(ct => ct.id === rule.effectsCellType) && ruleset.cellTypes.some(ct => ct.id === rule.cellBecomes))) {
      res.status(400).send({ msg: "Error adding rule: a rule should not refer to cell types that are not part of the ruleset" });
    } else {
      ruleset.rules.push(rule);

      await user.save();
      res.status(200).send({ rulesets: user.rulesets, ruleset: ruleset, rule: ruleset.rules[ruleset.rules.length - 1] });
    }

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.patch('/rule', checkAuth, async (req, res) => {
  try {
    const { rulesetId, rule } = req.body;
    const userId = req.userData.userId;
    const user = await User.findById(userId);

    if (user === null) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const ruleset = user.rulesets.id(rulesetId);

    if (!(ruleset.cellTypes.some(ct => ct.id === rule.effectsCellType) && ruleset.cellTypes.some(ct => ct.id === rule.cellBecomes))) {
      res.status(400).send({ msg: "Error updating rule: a rule should not refer to cell types that are not part of the ruleset" });
    } else {
      const ruleToUpdate = ruleset.rules.id(rule._id);

      for (const key in rule) {
        ruleToUpdate[key] = rule[key];
      }

      await user.save();
      res.status(200).send({ rulesets: user.rulesets, ruleset: ruleset, rule: ruleToUpdate });
    }

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.delete('/rule', checkAuth, async (req, res) => {
  try {
    const { rulesetId, rule } = req.body;
    const userId = req.userData.userId;
    const user = await User.findById(userId);

    if (user === null) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const ruleset = user.rulesets.id(rulesetId);
    const ruleIndex = ruleset.rules.findIndex(r => r._id.toString() === rule._id);

    if (ruleIndex < 0) {
      return res.status(404).json({ msg: 'Rule not found' });
    }

    ruleset.rules.splice(ruleIndex, 1);

    await user.save();
    res.status(200).send({ rulesets: user.rulesets, ruleset: ruleset });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;