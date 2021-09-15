const router = require("express").Router();
const { UniqueConstraintError } = require("sequelize/lib/errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
let validateJWT = require("../middleware/validate-jwt");

const { UserModel, TripModel, ParkModel, TripsParks } = require("../models");

// User Register
router.post('/register', async (req, res) => {
    let { firstName, lastName, username, email, password } = req.body.user;
    try {
        const User = await UserModel.create({
            firstName,
            lastName,
            username,
            email,
            password: bcrypt.hashSync(password, 13),
            role,
        });

        let token = jwt.sign({ id: User.id, role: User.role }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });

        res.status(201).json({
            message: "You are registered!",
            user: User,
            sessionToken: token,
        });
    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            res.status(409).json({
                message: "This username or email is already in use.",
            });
        } else {
            res.status(500).json({
                message: `[Error]: ${err}`,
            });
        }
    }
});

// User Login
router.post('/login', async (req, res) => {
    let { username, password } = req.body.user;

    try {
        const loginUser = await UserModel.findOne({
            where: {
                username: username,
            },
        });
        if (loginUser) {
            let passwordComparison = await bcrypt.compare(password, loginUser.password);

            if (passwordComparison) {
                let token = jwt.sign( { id: loginUser.id, role: loginUser.role }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });
                res.status(200).json({
                    user: loginUser,
                    message: "Welcome back!",
                    sessionToken: token,
                });
            } else {
                res.status(401).json({
                    message: "Incorrect username or password."
                })
            }
        } else {
            res.status(401).json({
                message: "Incorrect username or password."
            });
        }
    } catch (err) {
        res.status(500).json({
            message: "Failed to log you in."
        });
    }
});

// Get All Users - Admin Route
// router.get('/:role', (req.params.role === 'basic' ? validateJWT : null), async(req, res) => {
//     try {
//         let users = await UserModel.findAll();
//         res.status(200).json(users);
//     } catch (err) {
//         res.status(500).json({ Error: err });
//     }
// });

// Get Specific User
router.get('/:uId', validateJWT, async(req, res) => {
    const userId = req.params.uId;
    try {
        const singleUser = await UserModel.findOne({
            where: {
                id: userId
            },
            include: TripModel,
        })
        res.status(200).json(singleUser);
    } catch (err) {
        res.status(500).json({ Error: err });
    }
});

module.exports = router;