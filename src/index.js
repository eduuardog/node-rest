const express = require('express');
const app = express();
const { authRoutes, projectsRoutes } = require('./routes');


app.use(express.json());
app.use('/auth', authRoutes);
app.use('/projects', projectsRoutes);

app.use((request, response) => {
  return response.status(404).send({ error: 'resource not found' });
})

app.listen(8080, () => console.log("Server is running..."));

