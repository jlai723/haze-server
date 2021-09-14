const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Trip = sequelize.define("trip", {
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
        type: DataTypes.TEXT,
    },
});

module.exports = Trip;