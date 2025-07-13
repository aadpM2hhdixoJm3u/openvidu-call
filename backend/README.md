# OpenVidu Call Backend

This is the backend of OpenVidu Call. It is a Node.js application that uses [Express](https://expressjs.com/) as web server.

## How to run

For running the backend you need to have installed [Node.js](https://nodejs.org/). Then, you can run the following commands:

```bash
npm install
npm run dev:start
```

This will start the backend in development mode. The server will listen on port 6080.
You can change the port and other default values in the file `src/config.ts`.

## How to build

For building the backend you can run the following command:

```bash
npm install
npm run build
```

## Authentication

The backend supports three authentication modes selected through the `AUTH_MODE` environment variable:

* `basic` - default HTTP Basic authentication.
* `oidc` - OpenID Connect using `passport-openidconnect`.
* `saml` - SAML 2.0 using `passport-saml`.

Depending on the chosen mode, additional environment variables are required:

### OIDC variables

```
OIDC_ISSUER_URL      Issuer identifier
OIDC_AUTH_URL        Authorization endpoint
OIDC_TOKEN_URL       Token endpoint
OIDC_USERINFO_URL    User info endpoint
OIDC_CLIENT_ID       Client identifier
OIDC_CLIENT_SECRET   Client secret
OIDC_CALLBACK_URL    Callback URL used by the application
```

### SAML variables

```
SAML_ENTRY_POINT   Identity provider entry point URL
SAML_ISSUER        Issuer string for this service
SAML_CALLBACK_URL  Assertion consumer service URL
SAML_CERT          Identity provider certificate
```

OIDC and SAML strategies expose their login callbacks at `/call/api/auth/oidc/callback` and `/call/api/auth/saml/callback` respectively.
