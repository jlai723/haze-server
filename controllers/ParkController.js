const router = require("express").Router();
let validateJWT = require("../middleware/validate-jwt");

const { UserModel, TripModel, ParkModel, TripsParks } = require("../models");

// Create Park
router.post("/:tId/create", validateJWT, async(req, res) => {
    const { parkName, parkAddress, parkCode, parkUrl, parkImage, parkImageAlt, parkStartDate, parkEndDate, parkNotes } = req.body.park;
    const parkEntry = {
        parkName,
        parkAddress,
        parkCode,
        parkUrl,
        parkImage,
        parkImageAlt,
        parkStartDate,
        parkEndDate,
        parkNotes,
    };
    try {
        let trip = await TripModel.findOne({ where: { id: req.params.tId } });
        if (trip) {
            const newPark = await ParkModel.create(parkEntry);
            res.status(200).json(newPark);
        } else {
            res.status(401).json({ Message: "Can't add park, trip does not exist" })
        }
    } catch (err) {
        res.status(500).json({ Error: err })
    }
});

// Connect Park and Trip in through table
router.post("/:tId/addpark/:pId", validateJWT, async(req, res) => {
    try {
        let result = await TripsParks.create({
            tripId: req.params.tId,
            parkId: req.params.pId
        })
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ Error: err })
    }
});

// Get All Parks by Trip
router.get("/:tId/all", validateJWT, async(req, res) => {
    try {
        let trip = await TripModel.findOne({ where: { id: req.params.tId } });
        let parks = trip ? await trip.getParks() : null;
        res.status(200).json(parks);
    } catch (err) {
        res.status(500).json({ Error: err })
    }
});

// Get Single Park in Trip
router.get("/:tId/:pId", validateJWT, async(req, res) => {
    try {
        let trip = await TripModel.findOne({ where: { id: req.params.tId } });
        let singlePark = trip ? await ParkModel.findOne({
            where: {
                id: req.params.pId
            },
        }) : null;
        // console.log(singlePark);
        res.status(200).json(singlePark);
    } catch (err) {
        res.status(500).json({ Error: err })
    }
});

// Park Update
router.put("/:tId/update/:pId", validateJWT, async(req, res) => {
    const { parkName, parkAddress, parkCode, parkUrl, parkImage, parkImageAlt, parkStartDate, parkEndDate, parkNotes } = req.body.park;
    const tripId = req.params.tId;
    const parkId = req.params.pId;

    const query = {
        where: {
            id: parkId
        }
    }

    const updatedPark = {
        parkName: parkName,
        parkAddress: parkAddress,
        parkCode: parkCode,
        parkUrl: parkUrl,
        parkImage: parkImage,
        parkImageAlt: parkImageAlt,
        parkStartDate: parkStartDate,
        parkEndDate: parkEndDate,
        parkNotes: parkNotes,
    };

    try {
        let trip = await TripModel.findOne({ where: { id: tripId } });
        const update = trip ? await ParkModel.update(updatedPark, query) : null
        res.status(200).json(updatedPark)
    } catch (err) {
        res.status(500).json({ Error: err })
    }
});

// Park Delete
router.delete("/:tId/delete/:pId", validateJWT, async(req, res) => {
    const tripId = req.params.tId;
    const parkId = req.params.pId;

    try {
        const query = {
            where: { id: parkId }
        };
        let trip = await TripModel.findOne({ where: { id: tripId } });
        let deletePark = trip ? await ParkModel.destroy(query) : null;
        res.status(200).json({ deletePark, Message: "Park (and association) Deleted" });
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

module.exports = router;