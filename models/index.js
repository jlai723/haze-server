const { sequelize } = require('../db');
const { DataTypes } = require('sequelize');

const UserModel = require('./UserModel');
const TripModel = require('./TripModel');
const ParkModel = require('./ParkModel');
const TripsParks = require('./TripsParksModel');

// const User = UserModel(sequelize, DataTypes);
// const Trip = TripModel(sequelize, DataTypes);
// const Park = ParkModel(sequelize, DataTypes);

UserModel.hasMany(TripModel);
TripModel.belongsTo(UserModel);

TripModel.belongsToMany(ParkModel, { through: TripsParks });
ParkModel.belongsToMany(TripModel, { through: TripsParks });

module.exports = { UserModel, TripModel, ParkModel, TripsParks };