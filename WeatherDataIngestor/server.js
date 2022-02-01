const express = require('express')

//init express
const app = express()
const port = 3000

const routes = require('./api/routes');
routes(app);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})