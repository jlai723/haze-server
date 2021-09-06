const Express = require("express");
const router = Express.router();
const { UserModel } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

router.post('/register', async (req, res) => {

})