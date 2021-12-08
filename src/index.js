const express = require('express');
const app = express();

app.use(express.json());
// app.use(express.urlencoded());

require('./controllers/authController')(app);
o
app.listen(8080, () => console.log("Server is running..."));

