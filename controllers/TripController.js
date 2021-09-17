const router = require("express").Router();
let validateJWT = require("../middleware/validate-jwt");

const { UserModel, TripModel, ParkModel } = require("../models");

// Create Trip
router.post("/create", validateJWT, async (req, res) => {
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
        let user = await UserModel.findOne({ where: { id: req.user.id } });
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

// Get All Trips for Signed In User
router.get("/all", validateJWT, async(req, res) => {
    try {
        let user = await UserModel.findOne({ where: { id: req.user.id } });
        let trips = user ? await TripModel.findAll({
            where: {
                userId: req.user.id,
            },
            include: ParkModel,
        }) : null;
        res.status(200).json(trips);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
})

// Get All Trips by User including all Parks of each Trip
router.get("/:uId/all", validateJWT, async (req, res) => {
    try {
        let user = await UserModel.findOne({ where: { id: req.params.uId } });
        let trips = user ? await TripModel.findAll({
            where: {
                userId: req.params.uId,
            },
            include: ParkModel,
        }) : null;
        res.status(200).json(trips);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

// Get Single Trip for Signed In User including all Parks
router.get("/:tId", validateJWT, async (req, res) => {
    const tripId = req.params.tId;
    const userId = req.user.id;
    try {
        const singleTrip = await TripModel.findOne({
            where: {
                id: tripId,
                userId: userId,
            },
            include: ParkModel,
        });
        res.status(200).json(singleTrip);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

// Get Single Trip for User including all Parks
router.get("/:uId/:tId", validateJWT, async (req, res) => {
    const tripId = req.params.tId;
    const userId = req.params.uId;
    try {
        const singleTrip = await TripModel.findOne({
            where: {
                id: tripId,
                userId: userId,
            },
            include: ParkModel,
        });
        res.status(200).json(singleTrip);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

// Trip Update
router.put("/:uId/update/:tId", validateJWT, async (req, res) => {
    const { tripName, tripStartDate, tripEndDate, tripImage, tripNotes, tripDestinations } = req.body.trip;
    const tripId = req.params.tId;
    const userId = req.params.uId;

    const query = {
        where: {
            id: tripId,
            userId: userId,
        }
    };

    const updatedTrip = {
        tripName: tripName,
        tripStartDate: tripStartDate,
        tripEndDate: tripEndDate,
        tripImage: tripImage,
        tripNotes: tripNotes,
        tripDestinations: tripDestinations,
        userId: userId,
    };

    try {
        const update = await TripModel.update(updatedTrip, query);
        res.status(200).json(updatedTrip);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

// Trip Delete
router.delete(":uId/delete/:tId", validateJWT, async (req, res) => {
    const userId = req.params.uId;
    const tripId = req.params.tId;

    try {
        const query = {
            where: {
                id: tripId,
            }
        };
        let user = await UserModel.findOne({ where: { id: userId } });
        let deleted = user ? await TripModel.destroy(query) : null;
        res.status(200).json({ deleted, Message: "Trip Deleted" });
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

module.exports = router;