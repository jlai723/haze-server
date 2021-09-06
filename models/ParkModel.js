const { DataTypes } = require("sequelize");
const { sequelize } = require("../db");

const Park = sequelize.define("park", {
    parkName: {
        type: DataTypes.STRING,
    },
    parkStartDate: {
        type: DataTypes.DATE,
    },
    parkEndDate: {
        type: DataTypes.DATE,
    },
    campground: {
        type: DataTypes.ARRAY(DataTypes.STRING),
    },
    place: {
        type: DataTypes.ARRAY(DataTypes.STRING),
    },
})

module.exports = Park;