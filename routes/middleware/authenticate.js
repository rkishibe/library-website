const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { email, username, role,} = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    res.locals.user = {
      email,
      username,
      role,
    };

    return next();
  } catch (err) {
    return res.status(401).json({ error: "Not authenticated" });
  }
};

module.exports = authMiddleware;

module.exports.checkRole = (roles) => (req, res, next) => {
  const token = req.cookies.token;

    if (!token) {
        return res.status(401).send('Unauthorized');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        if (roles.includes(decoded.role)) {
            return next();
        }
        res.status(403).send('Access Denied');
    } catch (ex) {
        res.status(401).send('Unauthorized');
    }
};

  