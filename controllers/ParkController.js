const router = require("express").Router();
let validateJWT = require("../middleware/validate-jwt");

const { UserModel, TripModel, ParkModel } = require("../models");

// Create Park
router.post("/:tripId/create", validateJWT, async(req, res) => {
    const { parkName, parkStartDate, parkEndDate, campground, place } = req.body.park;
    const parkEntry = {
        parkName,
        parkStartDate,
        parkEndDate,
        campground,
        place,
    };
    try {
        let trip = await TripModel.findOne({ where: { id: req.params.tripId }});
        if (trip) {
            const newPark = await ParkModel.create(parkEntry);
            // console.log(newPark);
            // await newPark.setTrip(trip);
            // await trip.setPark(newPark);
            // await newParkInstance.setTrip(trip);
            res.status(200).json(newPark);
        } else {
            res.status(401).json({ Message: "Can't add park, trip does not exist" })
        }
    } catch (err) {
        res.status(500).json({ Error: err })
    }
});

module.exports = router;