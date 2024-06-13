require("dotenv").config();
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const checkAuth = require('../middleware/tokenAuth');

router.get('/allrulesets', checkAuth, async (req, res) => {
  try {
    const userId = req.userData.userId;
    const user = await User.findById(userId);

    if (user === null) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.status(200).send(user.rulesets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/ruleset', checkAuth, async (req, res) => {
  try {
    const { rulesetId } = req.body;
    const userId = req.userData.userId;
    const user = await User.findById(userId);

    if (user === null) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const rulesetToGet = user.rulesets.id(rulesetId);

    if (!rulesetToGet) {
      return res.status(404).json({ msg: 'Ruleset not found' });
    }

    res.status(200).send(rulesetToGet);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/ruleset', checkAuth, async (req, res) => {
  try {
    const { ruleset } = req.body;
    const userId = req.userData.userId;
    const user = await User.findById(userId);

    if (user === null) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (ruleset.cellTypes.length === 0) {
      ruleset.cellTypes.push({
        id: 0,
        cellType: "empty",
        cellColor: "#000000"
      });
    }

    user.rulesets.push(ruleset);
    await user.save();
    res.status(200).send({rulesets: user.rulesets, rule: user.rulesets[user.rulesets.length - 1]});
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.patch('/ruleset', checkAuth, async (req, res) => {
  try {
    const { ruleset } = req.body;
    const userId = req.userData.userId;
    const user = await User.findById(userId);

    if (user === null) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const userWithUpdatedRuleset = await User.findOneAndUpdate(
      { "_id": userId, "rulesets._id": ruleset._id },
      {
        "$set": {
          "rulesets.$": ruleset
        }
      },
      { new: true }
    );

    res.status(200).send(userWithUpdatedRuleset.rulesets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.delete('/ruleset', checkAuth, async (req, res) => {
  try {
    const { rulesetId } = req.body;
    const userId = req.userData.userId;
    const user = await User.findById(userId);

    if (user === null) {
      return res.status(404).json({ msg: 'User not found' });
    }

    await User.findByIdAndUpdate(userId, {
      "$pull": {
        "rulesets": { "_id": rulesetId }
      }
    })

    res.status(200).send("Ruleset deleted successfully");
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;