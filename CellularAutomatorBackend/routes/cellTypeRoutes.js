require("dotenv").config();
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const checkAuth = require('../middleware/tokenAuth');

router.post('/cellType', checkAuth, async (req, res) => {
  try {
    const { rulesetId, cellType } = req.body;
    const userId = req.userData.userId;
    const user = await User.findById(userId);

    if (user === null) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const ruleset = user.rulesets.id(rulesetId);
    cellType.id = ruleset.cellTypes.reduce((maxCellTypeID, cellT) => Math.max(maxCellTypeID, cellT.id), 0) + 1;
    ruleset.cellTypes.push(cellType);
    await user.save();
    res.status(200).send({ rulesets: user.rulesets, ruleset: ruleset, cellType: cellType });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.patch('/cellType', checkAuth, async (req, res) => {
  try {
    const { rulesetId, cellType } = req.body;
    const userId = req.userData.userId;
    const user = await User.findById(userId);

    if (user === null) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const cellTypeInDB = user.rulesets.id(rulesetId).cellTypes.find(ct => ct.id === cellType.id);
    cellTypeInDB.cellType = cellType.cellType;
    cellTypeInDB.cellColor = cellType.cellColor;
    await user.save();
    res.status(200).send({ rulesets: user.rulesets, ruleset: user.rulesets.id(rulesetId), cellType: cellType });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

function deleteRulesRelatedToCellType(ruleset, cellType) {
  const rulesAfterDeletion = [];

  ruleset.rules.forEach(rule => {
    if (!(rule.cellBecomes === cellType.id || rule.effectsCellType === cellType.id || patternsIncludeCellType(rule.patterns, cellType))) {
      rulesAfterDeletion.push(rule);
    }
  })

  ruleset.rules = rulesAfterDeletion;
}

function patternsIncludeCellType(patterns, cellType) {
  for (const pattern of patterns) {
    if (pattern.cellTypeToCheck === cellType.id) {
      return true;
    }
  }

  return false;
}

router.delete('/cellType', checkAuth, async (req, res) => {
  try {
    const { rulesetId, cellType } = req.body;
    const userId = req.userData.userId;
    const user = await User.findById(userId);

    if (user === null) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const ruleset = user.rulesets.id(rulesetId);
    const cellTypeIndex = ruleset.cellTypes.findIndex(ct => ct.id === cellType.id);

    if (cellTypeIndex < 0) {
      return res.status(404).json({ msg: 'Cell type not found' });
    }

    deleteRulesRelatedToCellType(ruleset, cellType);
    ruleset.cellTypes.splice(cellTypeIndex, 1);
    await user.save();
    res.status(200).send({ rulesets: user.rulesets, ruleset: user.rulesets.id(rulesetId) });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;