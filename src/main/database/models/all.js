const Role = require("./role");
const User = require("./user");
const RawMaterial = require("./rawmaterial");
const Silo = require("./silo");
const DosingGroup = require("./dosinggroup");
const DosingGroupSilo = require("./dosinggroupsilo");
const Formula = require("./formula");
const FormulaDetail = require("./formuladetail");
module.exports = [
  Role,
  User,
  Silo,
  RawMaterial,
  DosingGroup,
  DosingGroupSilo,
  Formula,
  FormulaDetail,
];
