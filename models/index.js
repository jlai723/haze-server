const { sequelize } = require('../db');
const { DataTypes } = require('sequelize');

const UserModel = require('./UserModel');
const TripModel = require('./TripModel');
const ParkModel = require('./ParkModel');

const User = UserModel(sequelize, DataTypes);
const Trip = TripModel(sequelize, DataTypes);
const Park = ParkModel(sequelize, DataTypes);

User.hasMany(Trip);
Trip.belongsTo(User);

Trip.belongsToMany(Park, { through: 'Trips_Parks' });
Park.belongsToMany(Trip, { through: 'Trips_Parks' });

module.exports = { User, Trip, Park };