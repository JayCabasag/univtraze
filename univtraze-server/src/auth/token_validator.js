const { verify } = require('jsonwebtoken');

module.exports = {
  checkToken: (req, res, next) => {
    let token = req.get('authorization');

    if (token) {
      token = token.slice(7);

      verify(token, process.env.JSON_KEY, (err, decoded) => {
        if (err) {
          res.status(401).json({
            message: 'Invalid token',
          });
        } else {
          req.user = decoded;
          next();
        }
      });
    } else {
      res.status(401).json({
        message: 'Access denied, unauthorized user.',
      });
    }
  },
};
