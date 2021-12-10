const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authConfig = require('../config/auth.json');

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: '1min'
  })
}

async function register(request, response) {
  const { password, email, name } = request.body;
  try {
    if (await User.findOne({ email })) return response.status(400).send({ error: 'User already exists' });
    const user = await User.create({
      name,
      email,
      password
    });


    return response.json({
      user,
      token: generateToken({ id: user._id })
    });
  } catch (error) {
    return response.status(400).json({ error: 'Registration failed' });
  }
}

async function authenticate(request, response) {

  const { email, password } = request.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) return response.status(400).json({ error: 'User not found' });

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) return response.status(400).json({ error: 'Invalid password' });

    user.password = undefined;



    return response.json({
      user,
      token: generateToken({ id: user._id })
    });

  } catch (error) {
    return response.status(500).send(error.message);
  }

}
module.exports = {
  register,
  authenticate
}