import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'fallbacksecret',
    });
  }

  async validate(payload: any) {
    console.log('[✅ JWT STRATEGY] validate() triggered');
    console.log('[✅ JWT STRATEGY] payload:', payload);
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
