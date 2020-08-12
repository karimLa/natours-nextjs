import passport from 'passport';
import {
  Strategy as LocalStrategy,
  IStrategyOptions,
  VerifyFunction,
} from 'passport-local';
import {
  Strategy as JWTStrategy,
  ExtractJwt,
  StrategyOptions,
  VerifyCallback,
} from 'passport-jwt';
import User from '../server/models/User';
import { Request, Response, NextFunction } from 'express';
import { JWTSecret, JWTExpiresIn } from '../server/constants';

const JWToptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWTSecret,
  // issuer: 'natours.com',
  // audience: 'natours.com',
  algorithms: ['HS512', 'HS384', 'HS256'],
  jsonWebTokenOptions: {
    maxAge: JWTExpiresIn,
  },
};

const signupOptions: IStrategyOptions = {
  usernameField: 'email',
  // @ts-ignore
  passReqToCallback: true,
};
const signinOptions: IStrategyOptions = { usernameField: 'email' };

const authenticateByJWT: VerifyCallback = async (payload, done) => {
  const user = await User.findById(payload._id);

  if (user) {
    return done(null, user);
  }

  return done(null, false);
};

const signin: VerifyFunction = async (email, password, done) => {
  try {
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+password'
    );

    if (!user) {
      return done(undefined, false, {
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await user.comparePassword(password, user.password);
    // @ts-ignore
    user.password = null;

    if (isMatch) {
      return done(undefined, user);
    }

    return done(undefined, false, { message: 'Invalid email or password.' });
  } catch (error) {
    return done(error);
  }
};

// @ts-ignore
const signup: VerifyFunction = async (req, email, password, done) => {
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return done(null, false, {
        message: 'Account with that email address already exists.',
      });
    }

    // TODO(karim): add validation

    const user = await User.create({
      name: req.body.name,
      email,
      password,
      passwordConfirm: password,
    });

    // @ts-ignore
    user.password = null;

    return done(null, user);
  } catch (error) {
    return done(error);
  }
};

passport.use('signin', new LocalStrategy(signinOptions, signin));
passport.use('signup', new LocalStrategy(signupOptions, signup));
passport.use('jwt', new JWTStrategy(JWToptions, authenticateByJWT));

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.status(401).json({
    detail: 'You are not logged in! Please log in to gain access.',
  });
}

export function authenticate(strategy: string, cb?: (...args: any[]) => any) {
  if (cb) {
    return passport.authenticate(strategy, { session: false }, cb);
  } else {
    return passport.authenticate(strategy, { session: false });
  }
}
