const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');

function authMiddleware(request, response, next) {
  const authHeader = request.headers.authorization;

  if (!authHeader) return response.status(401).json({ error: 'No token provided' });
  const parts = authHeader.split(' ');

  if (!(parts.length === 2)) return response.status(401).json({ error: 'Token error' });
  const [scheme, token] = parts;

  if (!(/^Bearer$/i.test(scheme))) return response.status(401).json({ error: 'Token no formatted' });

  jwt.verify(token, authConfig.secret, (error, decoded) => {
    if (error) return response.status(401).json({ error: 'Token invalid' });
    request.userId = decoded.id;
    return next();
  })
}

module.exports = authMiddleware;