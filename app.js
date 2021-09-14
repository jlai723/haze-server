require('dotenv').config();
const Express = require("express");
const app = Express();
const dbConnection = require('./db');

const controllers = require('./controllers');

app.use(Express.json());

app.use(require('./middleware/headers'));

app.use('/user', controllers.UserController);
app.use('/trip', controllers.TripController);
app.use('/park', controllers.ParkController);

dbConnection.authenticate()
    .then(() => dbConnection.sync())
    // .then(() => dbConnection.sync({ force: true }))
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`[Server]: App is listening on ${process.env.PORT}.`);
        })
    })
    .catch((err) => {
        console.log(`[Server]: Server crashed. Error = ${err}`);
    })