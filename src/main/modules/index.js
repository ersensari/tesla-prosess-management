const auth = require('./auth');
const rawMaterial = require('./raw-material');
const dosingGroup = require('./dosing-group');
const formula = require('./formula');
const production = require('./production');
const reports = require('./reports');
const user = require('./user');
module.exports = [auth, rawMaterial, dosingGroup, formula, production, reports, user];
