const router = require("express").Router();
const { UniqueConstraintError } = require("sequelize/lib/errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { UserModel } = require("../models");

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
        });

        let token = jwt.sign({ id:User.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });

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
                let token = jwt.sign( {id: loginUser.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });
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

module.exports = router;