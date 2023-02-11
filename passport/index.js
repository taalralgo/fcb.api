const passport = require("passport");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Role = mongoose.model("Role");
const jwt = require('jsonwebtoken');

const config = require('../config');
const JwtStrategy = require("passport-jwt").Strategy;
const DiscordStrategy = require("passport-discord").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local");

const localOptions = { usernameField: "email" };

const tokenMake = user => {
  let payload = { id: user.id, time: Date.now() };
  return jwt.sign(payload, config.secret, { expiresIn: "7d" });
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => done(null, user));
});

const localLogin = new LocalStrategy(localOptions, async function (
  email,
  password,
  done
) {
  // Verify this username and password, call done with the username
  // if it is the correct username and password
  // otherwise, call done with false
  try {
    const user = await User.findOne({ email: email }).populate('role');
    if (user) {
      user.comparePassword(password, async function (err, isMatch) {
        if (err) {
          return done(err);
        }
        if (!isMatch) {
          return done(null, false);
        }
        user.token = tokenMake(user);
        await user.save();
        return done(null, user);
      });
    }else{
      return done(null, false);
    }
  } catch (error) {
    console.log(error);
    return done(error);
  }
});

/**********************************
 * Setup options for JWT strategy *
 **********************************/
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken("authorization"),
  secretOrKey: config.secret
};

/***********************
 * Create JWT Strategy *
 ***********************/
const jwtLogin = new JwtStrategy(jwtOptions, async function (payload, done) {

  try {
    const user = await User.findById(payload.id).populate('role');
    if (user) {
      return done(null, user)
    } else {
      return done(null, false)
    }
  } catch (err) {
    done(err, false);
  }
});

// const discordLogin = new DiscordStrategy(
//   {
//     clientID: config.discordClientId,
//     clientSecret: config.discordClientSecret,
//     callbackURL: "/auth/discord/callback"
//   },
//   async (accessToken, refreshToken, profile, done) => {
//     done(null, profile);
//   }
// );

// Tell passport to use this Strategy
passport.use(jwtLogin);
passport.use(localLogin);
// passport.use(discordLogin);
