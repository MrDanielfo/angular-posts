const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    // Se envía el token para ser usado en las rutas de post
    req.userData = { email: decodedToken.email, userId: decodedToken.userId }
    next();
  } catch (err) {
    res.status(401).json({
      message: 'You are not authenticated',
      err
    })
  }
}
