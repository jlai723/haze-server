const router = require("express").Router();
let validateJWT = require("../middleware/validate-jwt");

const { UserModel, TripModel, ParkModel } = require("../models");

// Create Trip
router.post("/create", validateJWT, async(req, res) => {
    const { tripName, tripStartDate, tripEndDate, tripImage, tripNotes, tripDestinations } = req.body.trip;
    const tripEntry = {
        tripName,
        tripStartDate,
        tripEndDate, 
        tripImage,
        tripNotes,
        tripDestinations,
    };
    try {
        let user = await UserModel.findOne({ where: { id: req.user.id }});
        if (user) {
            const newTrip = await TripModel.create(tripEntry);
            await newTrip.setUser(user);
            res.status(200).json(newTrip);
        } else {
            res.status(401).json({ Message: "Can't create trip, user does not exist" })
        }
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

// Get All Trips by User
router.get("/all/:id", validateJWT, async(req, res) => {
    try {
        let user = await UserModel.findOne({ where: { id: req.params.id }});
        let trips = user ? await user.getTrips() : null;
        if (trips) {
            let userTrips = trips.map((trip) => {
                return trip;
            })
            res.send(userTrips);
        } else {
            res.send(trips);
        }
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

// Get Trip for User by ID
router.get("/:id", validateJWT, async(req, res) => {
    const tripId = req.params.id;
    const userId = req.user.id;
    try {
        const singleTrip = await TripModel.findOne({
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