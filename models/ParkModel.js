const { DataTypes } = require("sequelize");
const db = require("../db");

const Park = db.define("park", {
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
        type: DataTypes.ARRAY,
    },
    place: {
        type: DataTypes.ARRAY,
    },
})

module.exports = Park;