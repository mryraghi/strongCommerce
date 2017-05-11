interface AuthConfig {
  CLIENT_ID: string;
  CLIENT_DOMAIN: string;
  AUDIENCE: string;
  REDIRECT: string;
  SCOPE: string;
}

export const AUTH_CONFIG: AuthConfig = {
  CLIENT_ID: 'I33YIQTMcuukrwaT6CrNPOkWOWCKcGPz',
  CLIENT_DOMAIN: 'rbellon.eu.auth0.com',
  AUDIENCE: 'strong-commerce-api',
  REDIRECT: 'http://localhost:3000/callback',
  SCOPE: 'openid'
};
