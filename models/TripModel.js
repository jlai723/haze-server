const { DataTypes } = require("sequelize");
const db = require("../db");

const Trip = db.define("trip", {
    tripName: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    tripStartDate: {
        type: DataTypes.DATE,
    },
    tripEndDate: {
        type: DataTypes.DATE,
    },
    tripImage: {
        type: DataTypes.STRING,
    },
    tripNotes: {
        type: DataTypes.STRING,
    },
    tripDestinations: {
        type: DataTypes.ARRAY,
        allowNull: false,
    },
});

module.exports = Trip;