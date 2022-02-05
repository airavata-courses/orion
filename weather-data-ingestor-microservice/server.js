const express = require('express')
const routes = require('./api/routes');
 //init express
 const app = express()
 const port = 3001
 app.use(express.json());
 
 routes(app);

 app.listen(port, () => {
     console.log(`Server is listening on port ${port}`)
 }) 