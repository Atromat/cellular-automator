const mongoose = require('mongoose');

const coordRelativeToCell = new mongoose.Schema({
    _id: false,
    r: {
        type: Number, 
        required: true
    },
    c: {
        type: Number, 
        required: true
    },
})

const pattern = new mongoose.Schema({
    name: {
        type: String, 
        required: true
    },
    coordsRelativeToCell: [coordRelativeToCell],
    cellTypeToCheck: {
        type: Number, 
        required: true
    },
    operation: {
        type: String,
        required: true
    },
    min: Number,
    max: Number
})

const rule = new mongoose.Schema({
    ruleName: {
        type: String, 
        required: true
    },
    effectsCellType: {
        type: Number, 
        required: true
    },
    patterns: [pattern],
    cellBecomes: {
        type: Number, 
        required: true
    },
})

const cellType = new mongoose.Schema({
    _id: false,
    id: {
        type: Number, 
        required: true,
        unique: true
    },
    cellType: {
        type: String,
        required: true
    },
    cellColor: {
        type: String,
        required: true
    }
})

const ruleset = new mongoose.Schema({
    ruleSetName: {
        type: String, 
        required: true
    },
    cellTypes: [cellType],
    rules: [rule]
})

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    rulesets: [ruleset]
});

module.exports = mongoose.model('User', UserSchema);