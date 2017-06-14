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
  AUDIENCE: 'https://rbellon.eu.auth0.com/api/v2/',
  REDIRECT: 'http://www.strong-commerce.tk/callback',
  SCOPE: 'openid'
};
