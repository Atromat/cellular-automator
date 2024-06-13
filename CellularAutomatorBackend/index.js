require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const rulesetRoutes = require('./routes/rulesetRoutes');
const cellTypeRoutes = require('./routes/cellTypeRoutes');
const patternRoutes = require('./routes/patternRoutes');
const ruleRoutes = require('./routes/ruleRoutes');

const { MONGO_URL, PORT = 8080 } = process.env;

if (!MONGO_URL) {
  console.error("Missing MONGO_URL environment variable");
  process.exit(1);
}

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(MONGO_URL)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

app.use('/api/auth', authRoutes);
app.use('/api', rulesetRoutes);
app.use('/api', cellTypeRoutes);
app.use('/api', patternRoutes);
app.use('/api', ruleRoutes);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));