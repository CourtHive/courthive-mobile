require('dotenv').config();
import { Strategy, ExtractJwt } from 'passport-jwt';
import fs from 'fs-extra';

export const SECURITY_ALGORITHM = 'RS256';
export const KEY_ISSUER = 'courthive';
export const TOKEN_VALIDITY = '1w';

let publicKey;
const keyLocation = './cache/config/keys/publicKey.key';

if (fs.existsSync(keyLocation)) {
  publicKey = fs.readFileSync(keyLocation, 'utf8');
} else {
  console.log({ ERROR: 'missing publicKey' });
}

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  algorithm: SECURITY_ALGORITHM,
  expiresIn: TOKEN_VALIDITY,
  passReqToCallback: true,
  secretOrKey: publicKey,
  issuer: KEY_ISSUER
};

export function jwtStrategy() {
  return new Strategy(opts, async (req, payload, done) =>
    done(null, {
      userid: payload.userId,
      fName: payload.fName,
      lName: payload.lName,
      roles: payload.roles,
      personId: payload.personid
    })
  );
}
