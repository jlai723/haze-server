const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Park = sequelize.define("park", {
    parkName: {
        type: DataTypes.STRING,
    },
    parkAddress: {
        type: DataTypes.STRING,
    },
    parkCode: {
        type: DataTypes.STRING,
    },
    parkImage: {
        type: DataTypes.STRING,
    },
    parkStartDate: {
        type: DataTypes.DATE,
    },
    parkEndDate: {
        type: DataTypes.DATE,
    },
    parkNotes: {
        type: DataTypes.TEXT,
    },
})

module.exports = Park;