import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 10,
        jwksUri: process.env.AUTH_JWKS_URI ?? '',
      }),
      issuer: process.env.AUTH_ISSUER,
      // audience: process.env.AUTH_AUDIENCE,
      algorithms: ['RS256'],
    });
  }

  validate(payload: any, done: VerifiedCallback): unknown {
    if (!this.isValidSubject(payload)) {
      return done(new Error('Invalid token payload: missing sub claim'), false);
    }
    return done(null, { sub: payload.sub });
  }

  isValidSubject(payload: any): payload is { sub: string } {
    return (
      typeof payload === 'object' &&
      payload !== null &&
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      typeof payload.sub === 'string' &&
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      payload.sub.length > 0
    );
  }
}
