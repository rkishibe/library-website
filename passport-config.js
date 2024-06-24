const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('./models/user');

function initialize(passport) {
  const authenticateUser = async (email, password, done) => {
    try {
      // Find the user by email in your MongoDB collection
      const user = await User.findOne({ email: email });

      if (!user) {
        return done(null, false, { message: 'No user with that email' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Password incorrect' });
      }
    } catch (error) {
      return done(error);
    }
  };

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));

  // Serialize and deserialize user functions
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
}

module.exports = initialize;
