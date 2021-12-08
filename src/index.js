const express = require('express');
const app = express();

app.use(express.json());
// app.use(express.urlencoded());

app.get('/', (request, response) => response.send('OK'));

app.listen(8080, () => console.log("🔥 Server is running."));

