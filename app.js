require('dotenv').config();
const Express = require("express");
const app = Express();
const port = 3000;

app.listen(port, () => {
    console.log(`[Server]: App is listening on 3000.`);
})