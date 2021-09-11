const router = require("express").Router();
let validateJWT = require("../middleware/validate-jwt");

const { TripModel } = require("../models");
const { ParkModel } = require("../models");

// Create Trip
router.post("/create", validateJWT, async(req, res) => {
    const { tripName, tripStartDate, tripEndDate, tripImage, tripNotes, tripDestinations } = req.body.trip;
    const { id } = req.user;
    const tripEntry = {
        tripName,
        tripStartDate,
        tripEndDate, 
        tripImage,
        tripNotes,
        tripDestinations,
        userId: id,
    };
    try {
        const newTrip = await TripModel.create(tripEntry);
        res.status(200).json(newTrip);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

// Get All Trips by User
router.get("/", validateJWT, async(req, res) => {
    const { id } = req.user;
    try {
        const userTrips = await TripModel.findAll({
            where: {
                owner: id,
            },
            include: [
                {
                    model: TripModel,
                    include: [
                        {
                            model: ParkModel,
                        }
                    ]
                }
            ]
        });
        res.status(200).json(userTrips);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

// Get Trip for User by ID
router.get("/:id", validateJWT, async(req, res) => {
    const tripId = req.params.id;
    const userId = req.user.id;
    try {
        const singleTrip = await TripModel.findAll({
            where: { 
                id: tripId,
                owner: userId,
            }
        });
        res.status(200).json(singleTrip);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

// Trip Update
router.put("/:id", validateJWT, async(req, res) => {
    const { tripName, tripStartDate, tripEndDate, tripImage, tripNotes, tripDestinations } = req.body.trip;
    const tripId = req.params.id;
    const userId = req.user.id;

    const query = {
        where: {
            id: tripId,
            owner: userId,
        }
    };

    const updatedTrip = {
        tripName: tripName,
        tripStartDate: tripStartDate,
        tripEndDate: tripEndDate,
        tripImage: tripImage,
        tripNotes: tripNotes,
        tripDestinations: tripDestinations,
    };

    try {
        const update = await TripModel.update(updatedTrip, query);
        res.status(200).json(updatedTrip);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

// Trip Delete
router.delete("/:id", validateJWT, async(req, res) => {
    const tripId = req.params.id;
    const userId = req.user.id;

    try {
        const query = {
            where: {
                id: tripId,
                owner: userId,
            }
        }
        await TripModel.destroy(query);
        res.status(200).json({ Message: "Trip Deleted" });
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

module.exports = router;