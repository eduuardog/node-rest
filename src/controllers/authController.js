const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authConfig = require('../config/auth.json');
const { randomBytes } = require('crypto');

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: '10min'
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

async function forgotPassword(request, response) {
  const { email } = request.body;
  try {
    const user = await User.findOne({ email });
    console.log(user)

    if (!user) {
      return response.status(400).json({ error: 'User not found' });
    }
    const token = randomBytes(20).toString('hex');

    const now = new Date();
    now.setHours(now.getHours() + 1);

    await User.findByIdAndUpdate(user._id, {
      '$set': {
        passwordResetToken: token,
        passwordResetExpires: now
      }
    });

    response.json({ message: `Use this token for change password: ${token}` })
  } catch (error) {
    return response.status(400).json({ error: 'Error on forgot password, try again' })

  }
}

async function resetPassword(request, response) {
  const { email, token, newPassword } = request.body;

  try {
    const user = await User.findOne({ email }).select('+passwordResetToken passwordResetExpires');
    if (!user) return response.status(400).json({ error: 'User not found' });
    if (token !== user.passwordResetToken) return response.status(400).json({ error: 'This token is invalid' });

    const now = new Date();
    if (now > user.passwordResetExpires) return response.status(400).json({ error: 'Token expired, generate a new token' });

    user.password = newPassword;

    await user.save();

    return response.json({ message: 'Password updated' });

  } catch (error) {
    return response.status(400).json({ error: 'Error on reset password' })
  }



}

module.exports = {
  register,
  authenticate,
  forgotPassword,
  resetPassword
}