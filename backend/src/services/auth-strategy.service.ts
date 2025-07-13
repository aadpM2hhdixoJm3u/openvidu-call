import { Application, RequestHandler } from 'express';
import passport from 'passport';
import { Strategy as OIDCStrategy } from 'passport-openidconnect';
import { Strategy as SamlStrategy } from 'passport-saml';
import basicAuth from 'express-basic-auth';
import {
  AUTH_MODE,
  OIDC_CALLBACK_URL,
  OIDC_CLIENT_ID,
  OIDC_CLIENT_SECRET,
  OIDC_ISSUER_URL,
  OIDC_AUTH_URL,
  OIDC_TOKEN_URL,
  OIDC_USERINFO_URL,
  SAML_CALLBACK_URL,
  SAML_ENTRY_POINT,
  SAML_ISSUER,
  SAML_CERT,
  CALL_PRIVATE_ACCESS,
  CALL_USER,
  CALL_SECRET,
  CALL_ADMIN_USER,
  CALL_ADMIN_SECRET,
} from '../config.js';

export class AuthStrategyService {
  private static instance: AuthStrategyService;

  static getInstance(): AuthStrategyService {
    if (!this.instance) {
      this.instance = new AuthStrategyService();
    }
    return this.instance;
  }

  /**
   * Configure passport strategies and register initialization middleware.
   */
  configure(app: Application) {
    if (AUTH_MODE === 'oidc') {
      passport.use(
        new OIDCStrategy(
          {
            issuer: OIDC_ISSUER_URL,
            authorizationURL: OIDC_AUTH_URL,
            tokenURL: OIDC_TOKEN_URL,
            userInfoURL: OIDC_USERINFO_URL,
            clientID: OIDC_CLIENT_ID,
            clientSecret: OIDC_CLIENT_SECRET,
            callbackURL: OIDC_CALLBACK_URL,
          } as any,
          (_issuer: string, profile: any, done: any) => {
            return done(null, profile);
          },
        ),
      );
    } else if (AUTH_MODE === 'saml') {
      passport.use(
        new SamlStrategy(
          {
            entryPoint: SAML_ENTRY_POINT,
            issuer: SAML_ISSUER,
            callbackUrl: SAML_CALLBACK_URL,
            cert: SAML_CERT,
          },
          (profile: any, done: any) => {
            return done(null, profile);
          },
        ),
      );
    }

    if (AUTH_MODE !== 'basic') {
      app.use(passport.initialize());
    }
  }

  /** Generic user authentication middleware */
  userAuth(): RequestHandler {
    if (AUTH_MODE === 'basic') {
      return (req, res, next) => {
        if (CALL_PRIVATE_ACCESS === 'true') {
          const middleware = basicAuth({
            users: { [CALL_USER]: CALL_SECRET },
            challenge: true,
            unauthorizedResponse: () => 'Unauthorized',
          });
          return middleware(req, res, next);
        }
        return next();
      };
    }

    const strategy = AUTH_MODE === 'oidc' ? 'openidconnect' : 'saml';
    return passport.authenticate(strategy, { session: false });
  }

  /** Admin authentication middleware */
  adminAuth(): RequestHandler {
    if (AUTH_MODE === 'basic') {
      return basicAuth({
        users: { [CALL_ADMIN_USER]: CALL_ADMIN_SECRET },
        challenge: true,
        unauthorizedResponse: () => 'Unauthorized',
      });
    }

    // In OIDC/SAML modes there is no distinction
    const strategy = AUTH_MODE === 'oidc' ? 'openidconnect' : 'saml';
    return passport.authenticate(strategy, { session: false });
  }

  /** Middleware allowing either user or admin credentials */
  userOrAdminAuth(): RequestHandler {
    if (AUTH_MODE === 'basic') {
      return (req, res, next) => {
        if (CALL_PRIVATE_ACCESS === 'true') {
          const middleware = basicAuth({
            users: {
              [CALL_USER]: CALL_SECRET,
              [CALL_ADMIN_USER]: CALL_ADMIN_SECRET,
            },
            challenge: true,
            unauthorizedResponse: () => 'Unauthorized',
          });
          return middleware(req, res, next);
        }
        return next();
      };
    }

    const strategy = AUTH_MODE === 'oidc' ? 'openidconnect' : 'saml';
    return passport.authenticate(strategy, { session: false });
  }
}
