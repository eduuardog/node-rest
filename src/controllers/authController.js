const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (request, response) => {
  const { password, email, name } = request.body;
  try {
    if (await User.findOne({ email })) return response.status(400).send({ error: 'User already exists' });
    const user = await User.create({
      name,
      email,
      password
    });


    return response.send(user);
  } catch (error) {
    return response.status(400).send({ error: 'Registration failed' });
  }
})

router.post('/authenticate', async (request, response) => {

  const { email, password } = request.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) return response.status(400).send({ error: 'User not found' });

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) return response.status(400).send({ error: 'Invalid password' });

    user.password = undefined;

    return response.json({ user });
  } catch (error) {
    return response.status(500).send(error.message);
  }


})

module.exports = app => app.use('/auth', router);