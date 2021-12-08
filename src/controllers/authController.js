const express = require('express');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (request, response) => {
  try {
    const user = await User.create(request.body);


    response.send(user);
  } catch (error) {
    response.sendStatus(400).send({ error: 'Registration failed' });
  }
})

module.exports = app => app.use('/auth', router)